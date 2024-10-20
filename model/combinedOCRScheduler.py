import os
import schedule
import time
import json
import threading
import easyocr
import cv2
import google.generativeai as genai
from datetime import datetime

# Configure Gemini API with your key
# genai.configure(api_key=os.environ["GEMINI_API_KEY"])
genai.configure(api_key="GEMINI_API_KEY")

# Setup the generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

# Create the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Default prompt to instruct Gemini to extract medicine details
default_prompt = """
You are a medical assistant AI. You will be provided with text extracted from a prescription using OCR. 
Your job is to extract the following details from the text and return them in JSON format strictly following this schema:
{
    "medicines": [
        {
            "name": "string",
            "dosage": "string",
            "frequency": "string",
            "times": ["string"],   # format: HH:MM
            "meal_times": ["string"]
        }
    ],
    "duration": "string",
    "advice": "string",
    "follow_up": "string"
}

Please ensure the times are in 24-hour format (HH:MM) and provide only this JSON with no additional text.
"""


# Path for saving the schedule
SCHEDULE_FILE_PATH = 'schedule.json'
user_data = {}

# Function to load schedule from JSON
def load_data_from_file():
    global user_data
    try:
        with open(SCHEDULE_FILE_PATH, 'r') as file:
            user_data = json.load(file)
            # Ensure that each user has schedules initialized as a list
            for user in user_data:
                if "schedules" not in user_data[user]:
                    user_data[user]["schedules"] = []  # Initialize if missing
        print("Loaded existing schedule data.")
    except FileNotFoundError:
        print("No existing data found. Starting fresh.")
        user_data = {}

# Function to save schedule to JSON
def save_data_to_file():
    with open(SCHEDULE_FILE_PATH, 'w') as file:
        json.dump(user_data, file, indent=4)
    print("Data saved to file.")

# Function to handle user input and add/update reminders
def get_user_input():
    person_name = input("Enter the person's name: ")
    medicine = input("Enter the medicine name: ")
    dosage = input("Enter the dosage (e.g., '1 pill'): ")
    times_per_day = int(input("How many times per day should the medicine be taken? "))

    times = []
    for i in range(times_per_day):
        time_input = input(f"Time {i + 1}: ")
        times.append(time_input)
    
    return person_name, medicine, dosage, times

# Clear existing scheduled reminders for the specific medicine
def clear_existing_reminders(person_name, medicine):
    for job in schedule.get_jobs():
        # Check if the job's function is reminder_alert and the arguments match
        if job.job_func == reminder_alert and job.args == (person_name, medicine):
            schedule.cancel_job(job)

# Update the add_or_update_user_schedule function to clear existing reminders
def add_or_update_user_schedule(person_name, medicine, dosage, times):
    if person_name not in user_data:
        user_data[person_name] = {"schedules": []}  # Ensure schedules key is present

    # Check if the medicine already exists
    existing_schedule = next((schedule for schedule in user_data[person_name]["schedules"] if schedule['medicine'] == medicine), None)

    if existing_schedule:
        # Update existing entry
        existing_schedule['dosage'] = dosage
        existing_schedule['times'] = times
        print(f"Updated schedule for {person_name}: {medicine}, {dosage} at {', '.join(times)}")
    else:
        # Add new schedule entry
        schedule_info = {
            "medicine": medicine,
            "dosage": dosage,
            "times": times
        }
        user_data[person_name]["schedules"].append(schedule_info)  # Append to the schedules list
        print(f"Scheduled reminders for {person_name}: {medicine}, {dosage} at {', '.join(times)}")

    # Clear existing scheduled reminders for this medicine
    clear_existing_reminders(person_name, medicine)

    # Schedule reminders (add or update in the schedule)
    for reminder_time in times:
        schedule.every().day.at(reminder_time).do(reminder_alert, person_name, medicine, dosage)

    save_data_to_file()


# Function to display reminders
def reminder_alert(person_name, medicine, dosage):
    print(f"\nReminder: {person_name}, take {dosage} of {medicine}.")

# Function to view current schedules
def view_schedules():
    print("\nCurrent Schedules:")
    for user, schedules in user_data.items():
        print(f"User: {user}")
        for schedule in schedules:
            print(f"  Medicine: {schedule['medicine']}, Dosage: {schedule['dosage']}, Times: {', '.join(schedule['times'])}")
    print()

# Function to run the scheduler in a background thread
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

# Function to preprocess the image for OCR
def preprocess_image(image_path):
    # Load image using OpenCV
    image = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply adaptive thresholding to binarize the image
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)

    # Save preprocessed image (for debugging/testing)
    processed_image_path = 'processed_image.png'
    cv2.imwrite(processed_image_path, thresh)

    return processed_image_path

# Function to extract text using EasyOCR
def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en'])  # Initialize EasyOCR reader for English
    processed_image_path = preprocess_image(image_path)
    result = reader.readtext(processed_image_path, detail=0)  # Extract text
    text = ' '.join(result)
    return text

# Function to send extracted text to Gemini for parsing
def parse_with_gemini(extracted_text):
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [default_prompt]
            },
            {
                "role": "model",
                "parts": ["Ready to extract prescription details. Please provide the text."]
            },
        ]
    )

    # Send the extracted text to Gemini for parsing
    response = chat_session.send_message(extracted_text)

    # Return the parsed response from Gemini
    return response.text

# Function to process the JSON response and update the schedule
def process_parsed_info(parsed_info, person_name):
    parsed_json = json.loads(parsed_info)

    # Iterate over the medicines extracted
    for medicine in parsed_json.get("medicines", []):
        med_name = medicine.get("name")
        dosage = medicine.get("dosage")
        times = []

        # Convert meal times to placeholder times if necessary
        for time in medicine.get("times", []):
            if "Morning" in time:
                times.append("08:00")  # Placeholder for morning
            elif "Night" in time:
                times.append("20:00")  # Placeholder for night
            else:
                times.append(time)  # You can also add a default time if it's not specified
        
        # Ensure the time format is valid
        if all(validate_time_format(t) for t in times):
            add_or_update_user_schedule(person_name, med_name, dosage, times)
        else:
            print(f"Invalid time format for {med_name}, skipping.")


# Function to create the prompt including meal times
def create_default_prompt(person_name):
    user_meal_times = user_data[person_name]["meal_times"]
    meal_times_string = f'Breakfast: {user_meal_times["breakfast"]}, Lunch: {user_meal_times["lunch"]}, Dinner: {user_meal_times["dinner"]}'
    
    # Create the prompt
    prompt = f"""
You are a medical assistant AI. You will be provided with text extracted from a prescription using OCR. 
Your job is to extract the following details from the text and return them in JSON format strictly following this schema:
{{
    "medicines": [
        {{
            "name": "string",
            "dosage": "string",
            "frequency": "string",
            "times": ["string"],   # format: HH:MM
            "meal_times": ["string"]
        }}
    ],
    "duration": "string",
    "advice": "string",
    "follow_up": "string"
}}

Please ensure the times are in 24-hour format (HH:MM) and provide only this JSON with no additional text.

Meal Times: {meal_times_string}
"""
    return prompt

# Main OCR + Gemini parsing pipeline
def ocr_pipeline_with_gemini(image_path, person_name):
    # Step 1: Extract text from image using EasyOCR
    extracted_text = extract_text_from_image(image_path)
    print(f"\nExtracted Text:\n{extracted_text}")

    # Step 2: Create the prompt including meal times
    default_prompt = create_default_prompt(person_name)

    # Step 3: Send the extracted text to Gemini for parsing
    parsed_info = parse_with_gemini(extracted_text, default_prompt)
    print(f"\nParsed Prescription Information:\n{parsed_info}")

    # Step 4: Process the parsed info and update the schedule
    process_parsed_info(parsed_info, person_name)

# Modify the parse_with_gemini function to accept the prompt
def parse_with_gemini(extracted_text, default_prompt):
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [default_prompt]
            },
            {
                "role": "model",
                "parts": ["Ready to extract prescription details. Please provide the text."]
            },
        ]
    )

    # Send the extracted text to Gemini for parsing
    response = chat_session.send_message(extracted_text)

    # Return the parsed response from Gemini
    return response.text

def validate_time_format(time_str):
    try:
        datetime.strptime(time_str, "%H:%M")
        return True
    except ValueError:
        return False

# Function to add a new user
def add_new_user():
    user_name = input("Enter the new user's name: ")
    dob = input("Enter the date of birth (YYYY-MM-DD): ")
    meal_times = {
        "breakfast": input("Enter breakfast time (HH:MM): "),
        "lunch": input("Enter lunch time (HH:MM): "),
        "dinner": input("Enter dinner time (HH:MM): ")
    }
    
    user_data[user_name] = {
        "dob": dob,
        "meal_times": meal_times,
        "schedules": []  # Ensure schedules is initialized as a list
    }
    
    save_data_to_file()
    print(f"Added new user: {user_name}")


# Function to select a user
def select_user():
    print("Select a user:")
    for index, user in enumerate(user_data.keys()):
        print(f"{index + 1}. {user}")
    user_choice = int(input("Choose a user (number): ")) - 1
    user_name = list(user_data.keys())[user_choice]
    return user_name

# Main function with threading for the scheduler
def main():
    load_data_from_file()
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.daemon = True
    scheduler_thread.start()

    while True:
        print("\nMain Menu:")
        print("1. Add New User")
        print("2. Select User and Add Reminder")
        print("3. View Current Schedules")
        print("4. Exit")
        option = input("Choose an option (1/2/3/4): ")

        if option == '1':
            add_new_user()
        elif option == '2':
            user_name = select_user()
            # Now display options for adding reminders or OCR
            while True:
                sub_option = input(f"\nSelected User: {user_name}\n1. Add Manual Reminder\n2. OCR Prescription\n3. Back\nChoose an option: ")
                if sub_option == '1':
                    person_name, medicine, dosage, times = get_user_input()
                    add_or_update_user_schedule(user_name, medicine, dosage, times)
                elif sub_option == '2':
                    image_path = input("Enter the prescription image path: ")
                    ocr_pipeline_with_gemini(image_path, user_name)
                elif sub_option == '3':
                    break
                else:
                    print("Invalid option, please try again.")
        elif option == '3':
            view_schedules()
        elif option == '4':
            print("Exiting scheduler...")
            break
        else:
            print("Invalid option, please try again.")


# Entry point
if __name__ == "__main__":
    main()

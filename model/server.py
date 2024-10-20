import os
import time
import json
import easyocr
import cv2
import google.generativeai as genai
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your Next.js app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API with your key
genai.configure(api_key="GEMINI_API_KEY")  # Replace with your actual API key

# Setup the generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# MongoDB connection setup using pymongo
client = MongoClient("mongodb+srv://")  # Replace with your MongoDB URI
db = client['FinAdvise']  # Replace with your database name
family_members_collection = db['members']  # Replace with your collection name
medicine_collection = db['medicines']  # Replace with your collection name

# Path for saving the schedule
SCHEDULE_FILE_PATH = 'schedule.json'

# Load schedule from JSON
def load_data_from_file():
    try:
        with open(SCHEDULE_FILE_PATH, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print("No existing data found. Starting fresh.")
        return {}

# Save schedule to JSON
def save_data_to_file(data):
    with open(SCHEDULE_FILE_PATH, 'w') as file:
        json.dump(data, file, indent=4)
    print("Data saved to file.")

# Function to add a new user
def add_new_user(user_name):
    data = load_data_from_file()
    if user_name not in data:
        data[user_name] = {"family_members": {}}
        save_data_to_file(data)
        print(f"Added new user: {user_name}")

# Function to add a family member under a user
def add_new_family_member(user_name, family_name, dob, meal_times):
    data = load_data_from_file()
    if user_name in data:
        data[user_name]["family_members"][family_name] = {
            "dob": dob,
            "meal_times": meal_times,
            "schedules": []
        }
        save_data_to_file(data)
        print(f"Added family member {family_name} for user {user_name}.")

# Function to remove a family member
def remove_family_member(user_name, family_name):
    data = load_data_from_file()
    if user_name in data and family_name in data[user_name]["family_members"]:
        del data[user_name]["family_members"][family_name]
        save_data_to_file(data)
        print(f"Removed family member {family_name} for user {user_name}.")

# Function to remove a user
def remove_user(user_name):
    data = load_data_from_file()
    if user_name in data:
        del data[user_name]
        save_data_to_file(data)
        print(f"Removed user {user_name}.")

# Function to add or update a family member's schedule
def add_or_update_schedule(user_name, family_name, medicine, dosage, times):
    data = load_data_from_file()
    if user_name in data and family_name in data[user_name]["family_members"]:
        schedules = data[user_name]["family_members"][family_name]["schedules"]
        existing_schedule = next((s for s in schedules if s['medicine'] == medicine), None)

        if existing_schedule:
            existing_schedule['dosage'] = dosage
            existing_schedule['times'] = times
            print(f"Updated schedule for {family_name}: {medicine}, {dosage} at {', '.join(times)}")
        else:
            schedules.append({
                "medicine": medicine,
                "dosage": dosage,
                "times": times
            })
            print(f"Added new schedule for {family_name}: {medicine}, {dosage} at {', '.join(times)}")

        save_data_to_file(data)

# Function to add or update a family member's schedule in MongoDB
def add_or_update_schedule_mongodb(family_member_id, medicine, dosage, times):
    # Validate the medicine name
    if not medicine:
        raise ValueError("Medicine name cannot be empty.")

    # Create the document
    medicine_doc = {
        "family_member_id": family_member_id,
        "name": medicine,  # Ensure the 'name' field is included
        "dosage": dosage,
        "times": times
    }

    # Upsert document into MongoDB
    result = medicine_collection.update_one(
        {
            "family_member_id": family_member_id,
            "name": medicine  # Ensure we check against both family_member_id and name
        },
        {"$set": medicine_doc},
        upsert=True
    )
    
    if result.upserted_id:
        print(f"Inserted new medicine schedule for family member {family_member_id}: {medicine}")
    else:
        print(f"Updated existing medicine schedule for family member {family_member_id}: {medicine}")


# OCR + Gemini pipeline

# Preprocess the image for better OCR
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    processed_image_path = 'processed_image.png'
    cv2.imwrite(processed_image_path, thresh)
    return processed_image_path

# Extract text using EasyOCR
def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en'])
    processed_image_path = preprocess_image(image_path)
    result = reader.readtext(processed_image_path, detail=0)
    text = ' '.join(result)
    return text

# Create the prompt for Gemini based on meal times
def create_default_prompt(user_name, family_name):
    data = load_data_from_file()
    meal_times = data[user_name]["family_members"][family_name]["meal_times"]
    meal_times_str = f'Breakfast: {meal_times["breakfast"]}, Lunch: {meal_times["lunch"]}, Dinner: {meal_times["dinner"]}'
    
    prompt = f"""
You are a medical assistant AI. You will be provided with text extracted from a prescription using OCR. 
Your job is to extract the following details from the text and return them in JSON format strictly following this schema:
{{
    "medicines": [
        {{
            "name": "string",
            "dosage": "string",
            "times": ["string"]  # format: HH:MM
        }}
    ],
    "duration": "string",
    "advice": "string",
    "follow_up": "string"
}}

Ensure times are in 24-hour format (HH:MM). Provide the response only as JSON. Feel free to correct OCR misreadings as you see fit - for example, the dosage might be read as \"Moming\"  instead of \"Morning\" so you can fix such issues at your liberty when adding info to the JSON.

Meal Times: {meal_times_str}
"""
    return prompt

def create_default_prompt_audio(user_name, family_name):
    data = load_data_from_file()
    meal_times = data[user_name]["family_members"][family_name]["meal_times"]
    meal_times_str = f'Breakfast: {meal_times["breakfast"]}, Lunch: {meal_times["lunch"]}, Dinner: {meal_times["dinner"]}'
    
    prompt = f"""
You are a medical assistant AI. You will be provided with transcribed text of an audio recording of a medical prescription.
Your job is to extract the following details from the text and return them in JSON format strictly following this schema:
{{
    "medicines": [
        {{
            "name": "string",
            "dosage": "string",
            "times": ["string"]  # format: HH:MM
        }}
    ],
    "duration": "string",
    "advice": "string",
    "follow_up": "string"
}}

Ensure times are in 24-hour format (HH:MM). Provide the response only as JSON. Feel free to correct OCR misreadings as you see fit - for example, the dosage might be read as \"Moming\"  instead of \"Morning\" so you can fix such issues at your liberty when adding info to the JSON.

Meal Times: {meal_times_str}
"""
    return prompt

# Parse the extracted text using Gemini
def parse_with_gemini(extracted_text, default_prompt):
    chat_session = model.start_chat(
        history=[
            {"role": "user", "parts": [default_prompt]},
            {"role": "model", "parts": ["Ready to extract prescription details. Please provide the text."]},
        ]
    )
    response = chat_session.send_message(extracted_text)
    return response.text

# Process parsed info to update both MongoDB and schedule.json
def process_parsed_info(parsed_info, user_name, family_member_id):
    try:
        parsed_json = json.loads(parsed_info)

        if "medicines" not in parsed_json or not parsed_json["medicines"]:
            raise ValueError("No medicines found in the parsed prescription data.")

        for medicine in parsed_json.get("medicines", []):
            med_name = medicine.get("name")
            dosage = medicine.get("dosage")
            times = medicine.get("times", [])

            family_member_name = find_family_member(family_member_id)

            if med_name and dosage and all(validate_time_format(time) for time in times):
                # Update JSON
                add_or_update_schedule(user_name, family_member_name, med_name, dosage, times)
                
                # Update MongoDB
                add_or_update_schedule_mongodb(family_member_id, med_name, dosage, times)
            else:
                print(f"Invalid data for medicine: {med_name}, skipping this entry.")
    except json.JSONDecodeError:
        raise ValueError("Error parsing the response from Gemini. Ensure the data is in the correct format.")

# Validate time format (HH:MM)
def validate_time_format(time_str):
    try:
        datetime.strptime(time_str, "%H:%M")
        return True
    except ValueError:
        return False

# Find a family member given the family member object id as a parameter
def find_family_member(family_member_id):
    family_member = family_members_collection.find_one({"_id": ObjectId(family_member_id)})
    return family_member.get('name')
# FastAPI routes

# 1. Add a new user

class User(BaseModel):
    email: str

@app.post("/users/")
async def create_user(user: User):
    add_new_user(user.email)  # Change user.user_name to user.email
    return {"message": f"User {user.email} added successfully."}

# 2. Add a new family member under a user
# Define a model for the request body
class FamilyMember(BaseModel):
    family_name: str
    dob: str
    breakfast: str
    lunch: str
    dinner: str

@app.post("/users/{user_name}/family/")
async def create_family_member(user_name: str, member: FamilyMember):
    meal_times = {
        "breakfast": member.breakfast,
        "lunch": member.lunch,
        "dinner": member.dinner
    }
    add_new_family_member(user_name, member.family_name, member.dob, meal_times)
    return {"message": f"Family member {member.family_name} added under user {user_name}."}

# 3. Add or update a schedule for a family member under a user
@app.post("/users/{user_name}/family/{family_name}/schedule/")
async def add_or_update_family_schedule(user_name: str, family_name: str, medicine: str, dosage: str, times: list[str]):
    add_or_update_schedule(user_name, family_name, medicine, dosage, times)
    return {"message": f"Schedule for {medicine} updated for family member {family_name} under user {user_name}."}

# 4. Remove a family member under a user
@app.delete("/users/{user_name}/family/{family_name}/")
async def delete_family_member(user_name: str, family_name: str):
    remove_family_member(user_name, family_name)
    return {"message": f"Family member {family_name} removed from user {user_name}."}

# 5. Remove a user
@app.delete("/users/{user_name}/")
async def delete_user(user_name: str):
    remove_user(user_name)
    return {"message": f"User {user_name} removed successfully."}

@app.post("/ocr/")
async def upload_image(
    user_name: str = Form(...),                
    family_member_id: str = Form(...), 
    file: UploadFile = File(...),
):

    # Save the uploaded file locally
    contents = await file.read()
    file_location = "uploaded_image.png"
    with open(file_location, "wb") as temp_file:
        temp_file.write(contents)

    family_member_name = find_family_member(family_member_id)

    # Step 2: Extract text from the image
    extracted_text = extract_text_from_image(file_location)
    print(f"\nExtracted Text:\n{extracted_text}")


    # Step 3: Create the prompt for Gemini
    default_prompt = create_default_prompt(user_name, family_member_name)

    # Step 4: Parse the extracted text using Gemini
    parsed_info = parse_with_gemini(extracted_text, default_prompt)
    print(f"\nParsed Prescription Information:\n{parsed_info}")

    # Step 5: Process the parsed info and update the family member's schedule
    process_parsed_info(parsed_info, user_name, family_member_id)

    return {"message": "Prescription processed and data saved successfully."}

@app.post("/audio-prescription/")
async def record_audio(
    user_name: str = Form(...),                
    family_member_id: str = Form(...), 
    transcript: str = Form(...),
):

    family_member_name = find_family_member(family_member_id)

    # Step 3: Create the prompt for Gemini
    default_prompt = create_default_prompt_audio(user_name, family_member_name)

    # Step 4: Parse the extracted text using Gemini
    parsed_info = parse_with_gemini(transcript, default_prompt)
    print(f"\nParsed Prescription Information:\n{parsed_info}")

    # Step 5: Process the parsed info and update the family member's schedule
    process_parsed_info(parsed_info, user_name, family_member_id)

    return {"message": "Prescription processed and data saved successfully."}


# Load existing data at startup
load_data_from_file()

# Run the FastAPI server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

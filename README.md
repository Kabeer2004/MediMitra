# 🏥 MediMitra - Family Medicine Scheduler & Reminder System

This project is a comprehensive solution developed in 24 hours as part of a hackathon. It enables families to manage and receive medicine reminders for their members, using OCR-based prescription processing and an integrated scheduling system that sends voice reminders through Google Home speakers. The system uses **Next.js**, **FastAPI**, **MongoDB**, **Python scripts**, and various APIs to provide a seamless experience for users. 

## 🛠️ Key Features
1. **User-friendly Web App**: Built using **Next.js** and **TailwindCSS**, the frontend allows users to manage their family members' medicine schedules and prescriptions.
2. **OCR and Speech-to-Text for Prescriptions**: The app supports both **image-based OCR** (using **EasyOCR**) and **voice dictation** for prescription entry, which is processed by the **Gemini API** to extract relevant details like medicine name, dosage, and frequency.
3. **Medicine Scheduling**: The system stores medicine schedules for each family member and integrates with **Google Home** to send voice reminders without requiring the wake word.
4. **Decentralized Schedule Management**: Medicine schedules and family details are stored in a local `schedule.json` file, which is synced with the MongoDB Atlas cloud for persistence.
5. **Scheduler Script**: A Python-based **scheduler** reads from the `schedule.json` file and triggers reminders at specified times, sending them to the Google Home speaker via **Home Assistant**.
6. **Admin and User Flow**: Admins can manage schedules for different family members, adding, viewing, and modifying medicine routines via an intuitive interface.

## 💻 Tech Stack
- **Frontend**: Next.js, TailwindCSS, GSAP (for animations)
- **Backend**: FastAPI (Python)
- **Database**: MongoDB Atlas (NoSQL Cloud DB)
- **OCR & APIs**:
  - EasyOCR (for text extraction from images)
  - Speech to Text for Audio Input of Prescriptions
  - Gemini API (for parsing medicine details from OCR and speech)
- **Scheduler**: Python script that reads the `schedule.json` file and creates reminders
- **Home Automation**: Home Assistant API integration for Google Home speaker
- **Authentication**: Custom authentication flow for users to securely log in and manage family data

## 🏗️ System Architecture

### 1. **Frontend** (Next.js)
- Users interact via the web app, which provides:
  - Family member management
  - Prescription uploading (via OCR or voice)
  - Viewing and editing medicine schedules
  - Animated UI elements for a smooth user experience
  
### 2. **Backend** (FastAPI)
- The FastAPI server handles:
  - **OCR**: Uploading prescriptions and extracting text using **EasyOCR** which is then processed with **Gemini API**.
  - **Speech-to-Text**: Receiving transcribed text from voice dictation and processing it with **Gemini API**.
  - **JSON Management**: Maintaining and updating the `schedule.json` file, which holds user, family, and medicine schedule data.
  - **Sync with MongoDB**: Storing medicine schedules in MongoDB Atlas for persistence.

### 3. **Scheduler**
- A separate Python script reads from the `schedule.json` file and creates reminders for each family member at the appropriate times.
- Integrates with **Home Assistant** to push reminders to a **Google Home** speaker using the **Google Cast** API, allowing the speaker to announce the medicine reminders without the wake word.

## 🗃️ Database Schema

### **schedule.json**
The `schedule.json` file is the backbone of the system, storing all user and medicine data in a structured format:
```json
{
    "user_email@example.com": {
        "family_members": {
            "family_member_name": {
                "dob": "YYYY-MM-DD",
                "meal_times": {
                    "breakfast": "HH:MM",
                    "lunch": "HH:MM",
                    "dinner": "HH:MM"
                },
                "schedules": [
                    {
                        "medicine": "Medicine Name",
                        "dosage": "Dosage Info",
                        "times": ["HH:MM", "HH:MM"]
                    }
                ]
            }
        }
    }
}
```
### **MongoDB Schema**:
- **User**: Stores user profile, email, and linked family members.
- **Members**: Stores information about family members of a certain user - like their name, mealtimes and so on.
- **Medicine**: Stores medicines linked to family members with fields for name, dosage, times, etc.

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (for Next.js)
- **Python 3.8+** (for FastAPI and Python scripts)
- **MongoDB Atlas account** (or local MongoDB instance)
- **Home Assistant setup** (with Google Home speaker integration)

### 1. **Frontend Setup (Next.js)**
1. Clone the repository:
   ```bash
   git clone https://github.com/username/repo-name.git
   cd interface
   npm install
   ```
2. Configure environment variables:
   Create a `.env.local` file and add your MongoDB Atlas connection string, FastAPI URL, and other secrets:
   ```bash
   NEXTAUTH_URL=http://localhost:8000
   NEXTAUTH_SECRET=
   MONGODB_URI=mongodb+srv://your_mongodb_atlas_connection_string
   GEMINI_API=Gemini_API_KEY
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### 2. **Backend Setup (FastAPI)**
1. Move into the backend directory:
   ```bash
   cd model
   ```
2. Install dependencies:
   ```bash
   pip install easyocr pydantic schedule uvicorn google.generativeai opencv pymongo bson
   ```
3. Start the FastAPI server:
   ```bash
   python server.py
   ```

### 3. **Scheduler Script**
1. Ensure the scheduler can access the `schedule.json` file.
2. Run the script:
   ```bash
   python scheduler.py
   ```

### 4. **Home Assistant Integration**
- Follow the [Home Assistant setup guide](https://www.home-assistant.io) to integrate with Google Home speakers.
- Once setup, ensure that the Home Assistant API is accessible by FastAPI.

## 🧪 Testing
- To test the system, start both the frontend and backend, then upload a prescription or dictate medicine instructions via the web app.
- Verify that:
  - The OCR and Gemini API successfully process the input.
  - Medicine schedules are stored in MongoDB and `schedule.json`.
  - Reminders are triggered on Google Home as per the schedule.

## 📚 Documentation
For detailed API documentation, visit:
- **FastAPI**: Once the server is running, navigate to `http://localhost:8000/docs` to see auto-generated API docs.
  
## 🛡️ Security
- Ensure environment variables containing sensitive information are not committed to version control.
- Use HTTPS for secure data transmission in production.

## 📝 Future Improvements
- **Authentication Enhancements**: Implement OAuth for enhanced security.
- **Mobile App**: Create a mobile app version of the web app.
- **Multiple Languages**: Add support for multiple languages for voice reminders.

## 💬 Contributing
We welcome contributions! Please read the [contributing guidelines](CONTRIBUTING.md) for details.

## 👨‍💻 Authors - Team CodeBros
- **Kabeer Ahmed Merchant**
- **Varad Deshpande**
- **Sushant Jadhav**

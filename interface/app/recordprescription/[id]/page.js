"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { FaMicrophone } from "react-icons/fa";

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const { id } = useParams();
  const { data: session, status } = useSession(); // Use session hook to get user email
  const [email, setEmail] = useState('');
  const [familyMemberId, setFamilyMemberId] = useState('');

  useEffect(() => {
    if (session) {
      setEmail(session.user.email); // Automatically set the logged-in user's email
    }
    if (id) {
      setFamilyMemberId(id); // Set the family member ID from the URL
    }
  }, [session, id]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      setRecognition(recognitionInstance);
    } else {
      alert("Your browser does not support Speech Recognition.");
    }
  }, []);

  const startRecording = () => {
    if (recognition && !isRecording) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('user_name', email); // Pass the user's email automatically
    formData.append('family_member_id', familyMemberId); // Pass the family member ID from the param
    formData.append('transcript', transcript);

    try {
      const response = await fetch('http://127.0.0.1:8000/audio-prescription/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log("Response from FastAPI:", data);
      // Handle success or error response here
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-dm mb-8">Record your Prescription</h1>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-3 text-black text-2xl hover:text-white font-semibold rounded ${
          isRecording ? "bg-red-500" : "bg-white"
        } hover:bg-purple-500 rounded-xl border-4 border-gray-400 flex flex-row`}
      >
        <FaMicrophone className="mr-2 translate-y-1" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <textarea
        className="mt-14 p-4 w-3/4 h-48 border border-purple-500 rounded-md focus:border-purple-400 text-white bg-transparent"
        value={transcript}
        readOnly
        placeholder="Transcribed text will appear here..."
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-3 mt-4 text-black text-2xl font-dm border-4 border-gray-400 hover:text-white font-semibold rounded-xl bg-white hover:bg-purple-500 hover:bg-opacity-80"
      >
        Submit
      </button>
    </div>
  );
}

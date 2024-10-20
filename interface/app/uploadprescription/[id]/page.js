"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function UploadPrescription() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [familyMemberId, setFamilyMemberId] = useState("");
  const fileInputRef = React.useRef(null);
  const router = useRouter();
  const { id } = useParams(); // Grab family member ID from the URL

  useEffect(() => {
    if (session) {
      setEmail(session.user.email); // Automatically set the logged-in user's email
    }
    if (id) {
      setFamilyMemberId(id); // Set the family member ID from the URL
    }
  }, [session, id]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...files]); // Store file objects for upload
    setPreviews((prevPreviews) => [...prevPreviews, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    // Validate form data before submitting
    if (previews.length === 0 || !email || !familyMemberId) {
      console.error("Cannot submit: Missing required fields or no images.");
      return;
    }

    const formData = new FormData();
    formData.append("user_name", email); // Pass the user's email automatically
    formData.append("family_member_id", familyMemberId); // Pass the family member ID from the param
    images.forEach((image) => {
      formData.append("file", image);
    });

    // Debugging: Check FormData content
    for (let key of formData.keys()) {
      console.log(key, formData.get(key));
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/ocr/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Response from FastAPI:", data);
      // Provide user feedback on success
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login"); // Redirect if not authenticated
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-[url('/blur-bg.svg')] bg-cover font-dm">
      <div className="w-full max-w-xl p-5 rounded-lg shadow-2xl bg-black flex flex-col items-center border border-darkPurple border-3">
        <h2 className="text-4xl font-semibold mb-6 text-white text-center">
          Upload Prescription
        </h2>

        {/* Image Upload Section */}
        <div className="relative w-full h-60 border border-dashed border-gray-500 flex items-center justify-center mb-6 shadow-lg rounded-lg">
          {previews.length === 0 ? (
            <span className="text-gray-400">
              No images selected. Please choose files to upload.
            </span>
          ) : (
            <>
              {previews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 mx-2">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full rounded"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    title="Remove Image"
                  >
                    <FaTimes className="text-white" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          className="mb-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all"
        >
          Select Files
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          multiple
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-white text-black py-3 rounded-lg hover:bg-purple-500 hover:text-white transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={previews.length === 0 || !email || !familyMemberId} // Disable if no images or empty fields
        >
          Submit
        </button>
      </div>
    </div>
  );
}

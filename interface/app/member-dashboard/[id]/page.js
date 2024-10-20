"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import NavbarInternal from "@app/components/NavbarInternal";
import { FaCamera, FaMicrophone } from "react-icons/fa";

export default function MemberDashboard() {
  const router = useRouter();
  const { id } = useParams(); // Get the id from the URL (e.g., /app/member-dashboard/[id])
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(`/api/medicines/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setMedicines(data); // Set the retrieved medicines to state
      } catch (err) {
        setError(err.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchMedicines(); // Fetch medicines when id is available
    }
  }, [id]);

  // Function to handle the "Add Medicine" button click
  const handleAddMedicineClick = () => {
    if (id) {
      router.push(`/uploadprescription/${id}`); // Redirect to the uploadprescription/[id] page with the member id
    }
  };
  
  const handleAddMedicineClickAudio = () => {
    if (id) {
      router.push(`/recordprescription/${id}`); // Redirect to the uploadprescription/[id] page with the member id
    }
  };

  // Example function to handle going back in history
  const handleGoBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="w-screen h-screen bg-[url('/blur-purple.svg')] bg-cover ">
      <NavbarInternal />
      <div className="pt-32 w-full h-[250px] flex justify-center items-center">
        <div className="w-full flex justify-center items-center gap-x-20">
          <button
            onClick={handleAddMedicineClick}
            className="bg-white text-3xl flex flex-row font-dm hover:bg-purple-500 text-black hover:text-white px-6 py-3 rounded-xl border-4 border-gray-400"
          >
            <FaCamera className="mr-2 translate-y-0.5" />
            Add Medicines using Image
          </button>
          <button onClick={handleAddMedicineClickAudio} className="bg-white text-3xl flex flex-row font-dm hover:bg-purple-500 text-black hover:text-white px-6 py-3 rounded-xl border-4 border-gray-400">
            <FaMicrophone className="mr-2 translate-y-0.5" />
            Add Medicines using Audio
          </button>
        </div>
      </div>
      {/* <button
        onClick={handleGoBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Go Back
      </button> */}

      {/* Render Medicines */}
      <h2 className="text-5xl font-dm text-center pt-5">Your scheduled reminders</h2>
      <div className="medicines-list font-dm text-2xl flex flex-wrap justify-center pt-10">
      {loading && <p className="w-fulltext-center text-2xl text-gray-300">Loading medicines...</p>}
        {medicines.length === 0 ? (
          <p className="text-center text-2xl text-gray-300 pt-20">
            No medicines added yet
          </p>
        ) : (
          medicines.map((medicine) => (
            <div
              key={medicine._id}
              className="medicine-card h-[300px] flex flex-col p-4 m-2 border border-gray-300 hover:border-purple-500 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <h3 className="font-bold text-2xl">{medicine.name}</h3>
              <p className="text-gray-400 mt-4 mb-4">Dosage: <br /> {medicine.dosage}</p>
              <p className="text-gray-400">Times: <br /> {medicine.times.join(", ")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";
import NavbarInternal from "@app/components/NavbarInternal";
import { useState, useEffect } from "react";

export default function Marketplace() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data for medicines
    const dummyMedicines = [
      { _id: 1, name: "Paracetamol", dosage: "500mg", times: ["Morning", "Evening"], condition: "Cough/Cold" },
      { _id: 2, name: "Aspirin", dosage: "300mg", times: ["Once a Day"], condition: "Heart Disease" },
      { _id: 3, name: "Ibuprofen", dosage: "200mg", times: ["After Meals"], condition: "Pain Relief" },
      { _id: 4, name: "Cough Syrup", dosage: "10ml", times: ["Before Bed"], condition: "Cold/Cough" },
      { _id: 5, name: "Metformin", dosage: "850mg", times: ["Before Breakfast"], condition: "Diabetes" },
      { _id: 6, name: "Vitamin C", dosage: "1000mg", times: ["Morning"], condition: "Immunity Boost" },
      { _id: 7, name: "Cetirizine", dosage: "10mg", times: ["Before Sleep"], condition: "Allergies" },
      { _id: 8, name: "Amoxicillin", dosage: "500mg", times: ["Twice a Day"], condition: "Bacterial Infection" },
      { _id: 9, name: "Benadryl", dosage: "10ml", times: ["Night"], condition: "Cold/Allergies" },
    ];

    // Simulate a loading delay for fetching medicines
    setTimeout(() => {
      setMedicines(dummyMedicines);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="marketplace-page font-dm text-2xl flex flex-wrap justify-center pt-10">
        <NavbarInternal />
      {loading && <p className="w-full text-center text-2xl text-gray-300">Loading medicines...</p>}
      <div className="w-full h-full pt-20 flex flex-wrap">
      {medicines.length === 0 ? (
        <p className="text-center text-2xl text-gray-300 pt-20">No medicines available</p>
      ) : (
        medicines.map((medicine) => (
          <div
            key={medicine._id}
            className="medicine-card h-[350px] flex flex-col p-4 m-4 w-[250px] border border-gray-300 hover:border-purple-500 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <h3 className="font-bold text-xl">{medicine.name}</h3>
            <p className="text-gray-400 mt-2 mb-2">
              <strong>Dosage:</strong> {medicine.dosage}
            </p>
            <p className="text-gray-400 mb-2">
              <strong>Condition:</strong> {medicine.condition}
            </p>
            <p className="text-gray-400 mb-4">
              <strong>Times:</strong> {medicine.times.join(", ")}
            </p>
            <button
              className="mt-auto bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Buy Now
            </button>
          </div>
        ))
      )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";

export default function AddMember() {
  const { data: session, status } = useSession(); // Access session to get the email
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [breakfastTime, setBreakfastTime] = useState("");
  const [lunchTime, setLunchTime] = useState("");
  const [dinnerTime, setDinnerTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("User is not logged in");
      return;
    }

    // Format the meal times
    const formattedBreakfast = `${breakfastTime}`;
    const formattedLunch = `${lunchTime}`;
    const formattedDinner = `${dinnerTime}`;

    // Get the logged-in user's email
    const userEmail = session.user.email;

    // Send data to the FastAPI backend at the correct URL
    const fastAPIresponse = await fetch('http://127.0.0.1:8000/users/' + userEmail + '/family/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_name: name,
        dob,
        breakfast: formattedBreakfast,
        lunch: formattedLunch,
        dinner: formattedDinner,
      }),
    });

    const response = await fetch("/api/member", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          name,
          dob,
          Breakfast: formattedBreakfast,
          Lunch: formattedLunch,
          Dinner: formattedDinner,
      }),
  });

    if (response.ok) {
      const newMember = await response.json();
      alert("New family member added successfully!");
      router.push(`/new-member`);
    } else {
      alert("Failed to add new family member");
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <>
      <div className="w-screen h-full relative bg-[url('/blur-purple.svg')] bg-cover ">
  <NavbarInternal />

  {/* Main Section */}
  <div id="main" className="w-full h-full bg-gradient-to-r from-[#0F081A] to-black">
    <div className="flex justify-center items-center w-full h-full pt-24">
      <div className="w-[90%] md:w-[70%] lg:w-[40%] bg-[#000000] border border-purple-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-dm font-bold text-center text-white mb-5">
          Add New Family Member
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              className="block w-full p-3 bg-black text-white border border-purple-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              className="block w-full p-3 bg-black text-white border border-purple-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Breakfast Time
              </label>
              <input
                type="time"
                className="block w-full p-3 bg-black text-white border border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md"
                value={breakfastTime}
                onChange={(e) => setBreakfastTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lunch Time
              </label>
              <input
                type="time"
                className="block w-full p-3 bg-black text-white border border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md"
                value={lunchTime}
                onChange={(e) => setLunchTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dinner Time
            </label>
            <input
              type="time"
              className="block w-full p-3 bg-black text-white border border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md"
              value={dinnerTime}
              onChange={(e) => setDinnerTime(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full p-3 bg-white text-black rounded-lg shadow-lg font-dm hover:bg-purple-500  hover:text-white transition-transform transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

      </>
    );
  }
}

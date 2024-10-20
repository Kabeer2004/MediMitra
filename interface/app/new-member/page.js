"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use this for Next.js 13 and above
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";
import Image from "next/image";
import user from '../../public/user.png'; // Placeholder image

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState([]); // State to hold member data

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/member', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const membersData = await response.json();
        console.log("Fetched members:", membersData);
        setMembers(membersData); // Set the fetched members to state
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers(); // Call the function to fetch members

    // Redirect to login if the user is unauthenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]); // Depend on status and router

  const handleAddMember = () => {
    router.push("/add-member"); // Redirects to the "add-member" page
  };

  const handleMemberClick = (memberId) => {
    router.push(`/member-dashboard/${memberId}`); // Redirect to the member dashboard
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-screen h-screen flex flex-col"> {/* Full screen flex container */}
        <NavbarInternal /> {/* Navbar at the top */}

        <div
          id="main"
          className="flex flex-col items-center justify-center flex-grow bg-gradient-to-r from-[#0F081A] to-black p-6" // Allow main to grow
        >
          {/* Members List with Add Button */}
          <div className="flex items-center justify-center flex-wrap">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member._id}
                  className="flex flex-col items-center mx-4 mb-4 cursor-pointer" // Add cursor pointer for better UX
                  onClick={() => handleMemberClick(member._id)} // Add onClick handler
                >
                  <div className="member-logo rounded-full overflow-hidden border-2 border-gray-400 w-32 h-32 flex items-center justify-center"> {/* Increased size */}
                    <Image
                      src={member.profileImage || user} // Use the Next.js Image component
                      alt={member.name}
                      width={128} // Width of the image
                      height={128} // Height of the image
                      className="object-cover w-full h-full" // Ensure image covers the circle
                    />
                  </div>
                  <div className="member-name text-white text-xl mt-2"> {/* Increased font size */}
                    {member.name.split(' ')[0]} {/* Display only the first part of the name */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-300">No members found.</p>
            )}
            {/* Add Member Button with Tooltip */}
            <div className="relative flex flex-col items-center mx-4 mb-4">
              <button
                onClick={handleAddMember}
                className="text-6xl text-gray-400 hover:text-blue-500 transition duration-200"
                title="Add New Member"
              >
                +
              </button>
              <div className="absolute bottom-full mb-2 px-2 py-1 text-sm text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                New Member
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// pages/index.js
"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import useGsapAnimations from "./hooks/landing-animation";
import Navbar from "./components/Navbar";

export default function Home() {
  useGsapAnimations();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission behavior (if used in a form)
    
    // Navigate to the desired path
    router.push('/signup');
  };

  return (
		<div className="bg-[url('/bg.svg')] bg-cover min-h-screen flex flex-col overflow-x-hidden">
			<Head>
				<title>MediMitra</title>
				<meta name="description" content="Voice Enabled Medicines Reminder" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar />
			<main className="w-full flex flex-col items-center  relative">
				<h1
					id="animated-h1"
					className="text-4xl font-dm tracking-tight md:text-7xl lg:text-[12rem] font-bold text-center mt-5"
				>
					Medication
				</h1>
				<h1
					id="animated-h1"
					className="text-4xl font-dm tracking-tight md:text-7xl lg:text-9xl mb-12 font-bold text-center"
				>
				Made Easy
				</h1>

				{/* SVG container positioned lower */}
				<div className="absolute lg:mt-10 flex flex-row md:gap-x-40 lg:gap-x-[45rem]">
					{" "}
					{/* Adjusted positioning and gap */}
					<div className="hidden md:flex md:translate-y-14 md:-translate-x-14 lg:translate-y-20 lg:translate-x-24">
						{" "}
						{/* Increased sizes */}
						<img
							id="left-svg"
							src="/chat-img.svg"
							alt="Chat Image"
							className="lg:w-[20rem] lg:h-[20rem] transform -rotate-12 md:w-64 md:h-64"
						/>
					</div>
					<div className="hidden md:flex md:translate-y-5 md:translate-x-4 transform rotate-30 lg:-translate-x-24 lg:translate-y-16">
						{" "}
						{/* Increased sizes */}
						<img
							id="right-svg"
							src="/graph-icon.svg"
							alt="Graph Icon"
							className="lg:w-[20rem] transform rotate-12 lg:h-[20rem] md:w-52 md:h-52"
						/>
					</div>
				</div>
				{/* Responsive paragraph */}
				<p
					id="hero-description"
					className="text-center font-light font-inter text-lg md:text-xl lg:text-2xl mb-5 leading-relaxed md:leading-relaxed lg:leading-relaxed"
				>
					Voice-enabled medicine reminders and seamless 
					<br className="hidden font-inter md:block" /> and
					integration with smart assistants for enhanced {" "}
					<br className="hidden font-inter md:block" /> health and peace of mind.
				</p>

				{/* Responsive input and button */}
				{/* <div
					id="waitlist-btn"
					className="flex items-center justify-center flex-col md:flex-row gap-2 w-full md:w-auto mb-16"
				>
					

					<button
						onClick={handleSubmit}
						className="bg-white flex justify-center items-center font-inter font-normal h-12 hover:bg-purple-500 hover:drop-shadow-lg hover:text-white text-black p-2 md:p-3 lg:p-4 rounded-xl text-sm md:text-base lg:text-lg md:w-auto"
					>
						Get Started
					</button>
				</div> */}
				{message && <p className="text-green-500">{message}</p>}
				{error && <p className="text-red-500">{error}</p>}
				{/* Ellipse SVG positioned below the button */}
				<div className="w-full">
					<Image
						src="/ellipse.svg"
						alt="Ellipse"
						layout="responsive"
						width={1920}
						height={500}
						className="w-full object-cover"
					/>
				</div>
				{/* Responsive text sections */}
				<div className="bg-black font-dm w-full pb-40">
					<h2
						id="problem-text"
						className="text-white text-center text-4xl mb-16 md:text-5xl lg:text-6xl font-sans font-bold leading-relaxed"
					>
						The problems
					</h2>
					<h2
						id="problem-text"
						className="text-custom-purple text-center mb-16 font-sans  text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug mt-2"
					>
						Forgetting Medication Timings
					</h2>
					<h2
						id="problem-text"
						className="text-custom-purple2 text-center mb-16 font-sans  text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug mt-2"
					>
						Living Alone without Assistance
					</h2>
					<h2
						id="problem-text"
						className="text-custom-purple3 text-center font-sans  text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug mt-2"
					>
						Lack of Personalized Reminders
					</h2>
				</div>
				<div className="bg-black w-full pb-40">
					<p
						id="easier-way-text"
						className="text-white text-6xl font-sans font-bold text-center"
					>
						There is an easier way
					</p>
				</div>
				<div className="bg-black w-full pb-20">
					<h2
						id="features-h2"
						className="text-white text-6xl font-sans font-bold text-center"
					>
						Effortless Medication Management
					</h2>
				</div>
				{/* Feature cards section */}
				<div className="bg-black w-full h-full pb-5">
					<div className="bg-black grid grid-cols-1 md:grid-cols-2 gap-10 p-10 mx-auto max-w-screen-lg">
						{/* Feature Card 1 */}
						<div className="feature-card flex flex-col items-center bg-black border-2 border-gray-600 p-10 rounded-lg w-full">
							<Image
								src="/feature-1-icon.svg"
								alt="Feature Icon 1"
								layout="fixed"
								width={64}
								height={64}
								className="object-contain pb-2"
							/>
							<h2 className="text-white font-bold font-sans text-center text-xl mt-3 pb-1">
							Personalized Reminders
							
							</h2>
							<p className="text-center font-inter font-extralight text-base">
							Tailored medication alerts based on your unique prescription needs
							</p>
						</div>

						{/* Feature Card 2 */}
						<div className="feature-card flex flex-col items-center bg-black border-2 border-gray-600 p-10 rounded-lg w-full">
							<Image
								src="/feature-2-icon.svg"
								alt="Feature Icon 2"
								layout="fixed"
								width={64}
								height={64}
								className="object-contain"
							/>
							<h2 className="text-white font-bold font-sans text-center text-xl mt-5 pb-1">
							Interactive Voice Assistance
							</h2>
							<p className="text-center font-light font-inter text-base">
							Engage with voice-enabled medicine reminder for timely reminders.
							</p>
						</div>

						{/* Feature Card 3 */}
						<div className="feature-card flex flex-col items-center bg-black border-2 border-gray-600 p-10 rounded-lg w-full">
							<Image
								src="/feature-4-icon.svg"
								alt="Feature Icon 3"
								layout="fixed"
								width={64}
								height={64}
								className="object-contain"
							/>
							<h2 className="text-white font-bold font-sans text-center text-xl mt-3 pb-1">
							Prescription Reader
							</h2>
							<p className="text-center font-light font-inter text-base">
							Streamline your prescription management and ensure accurate medication intake effortlessly.
							</p>
						</div>

						{/* Feature Card 4 */}
						<div className="feature-card flex flex-col items-center bg-black border-2 border-gray-600 p-10 rounded-lg w-full">
							<Image
								src="/feature-3-icon.svg"
								alt="Feature Icon 4"
								layout="fixed"
								width={64}
								height={64}
								className="object-contain"
							/>
							<h2 className="text-white font-bold font-sans text-center text-xl mt-3 pb-1">
							Medicine Buying Recommendations
							</h2>
							<p className="text-center font-light font-inter text-base">
							Receive personalized suggestions for purchasing medications, ensuring you find the best prices and reputable pharmacies for your needs.
							</p>
						</div>
					</div>
				</div>
				<div className="bg-[url('/blur-bg.svg')] flex flex-col w-full h-full items-center">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-full  max-w-screen-lg">
						{/* Existing Solution Card */}
						<div className="existing-solution-card relative w-full md:ml-5  bg-black border-4 border-red-500 shadow-2xl shadow-red-400 rounded-3xl p-6">
							<div className="absolute inset-0 rounded-lg border-gradient-to-r from-red-400 via-red-500 to-red-600 opacity-75 pointer-events-none"></div>
							<div className="relative z-10 flex flex-col ">
								<h3 className="content-item text-white text-3xl font-sans md:text-4xl lg:text-5xl whitespace-nowrap p-5 font-bold mb-8">
									Existing Solution
								</h3>
								<p className="content-item flex items-center font-sans text-red-200 text-2xl font-medium pl-5 pb-14">
									<span className="mr-2 text-red-500">
										&#x2716;
									</span>
									Reliance on Memory
								</p>
								<p className="content-item flex items-center font-sans text-red-200 text-red text-2xl font-medium pl-5 pb-16">
									<span className="mr-2 text-red-500">
										&#x2716;
									</span>
									Lack of Personalization
								</p>
								<p className="content-item flex items-center font-sans text-red-200 text-red text-2xl font-medium pl-5 pb-5">
									<span className="mr-2 text-red-500">
										&#x2716;
									</span>
									Inconsistent Reminders
								</p>
							</div>
						</div>

						{/* Our Solution Card */}
						<div className="our-solution-card relative  md:mr-10 bg-black border-4  w-full shadow-2xl shadow-green-400 border-green-500 rounded-3xl p-6">
							<div className="absolute inset-0  rounded-lg opacity-75 pointer-events-none"></div>
							<div className="relative z-10 flex flex-col ">
								<h3 className="content-item text-white text-3xl font-sans font-bold md:text-4xl lg:text-5xl whitespace-nowrap p-5 mb-8">
									Our Solution
								</h3>
								<p className="content-item flex items-center font-sans text-green-200 text-2xl font-medium pl-5 pb-10">
									<span className="mr-2 text-green-500">
										&#x2714;
									</span>
									Automated Prescription Reading
								</p>
								<p className="content-item flex items-center font-sans text-green-200 text-2xl font-medium pl-5 pb-10">
									<span className="mr-2 text-green-500">
										&#x2714;
									</span>
									Personalized Voice Reminders
								</p>
								<p className="content-item flex items-center font-sans text-green-200 text-2xl font-medium pl-5 pb-16">
									<span className="mr-2 text-green-500">
										&#x2714;
									</span>
									Consistent and on-time Reminders
								</p>
							</div>
						</div>
					</div>

					<div className="relative py-20 flex flex-col w-full h-full items-center">
						{/* Top Left SVG */}
						<div className="absolute top-0 left-0 w-20 h-20 md:w-40 md:h-40 lg:w-64 lg:h-64 ml-2">
							<img
								src="/footer-1-icon.svg"
								alt="Top Left SVG"
								className="w-full h-full object-contain"
							/>
						</div>

						{/* Bottom Right SVG */}
						<div className="absolute bottom-0 right-0 w-20 h-20 md:w-40 md:h-40 lg:w-64 lg:h-64 mr-2">
							<img
								src="/footer-2-icon.svg"
								alt="Bottom Right SVG"
								className="w-full h-full object-contain"
							/>
						</div>

						<div className="relative z-10 flex flex-col items-center text-center max-w-screen-lg mx-auto">
							{/* <h3
								id="footer-section"
								className="text-white font-sans text-3xl md:text-3xl lg:text-4xl font-bold mb-8"
							>
								Get instant access
							</h3> */}
							{/* <p
								id="footer-section"
								className="text-white text-2xl font-sans md:text-lg lg:text-xl mb-8 max-w-prose"
							>
								Sign up to our waitlist now to receive instant
								access
								<br className="hidden md:block" /> to MediMitra
								as soon as its ready.
							</p> */}
							<div
								id="footer-section"
								className="flex flex-col md:flex-row items-center gap-2 w-full max-w-md"
							>
								{/* <input
									className="bg-gray-500 text-white opacity-50 rounded-xl p-2 md:p-3 lg:p-4 pl-5 md:pl-6 lg:pl-8 text-sm md:text-base lg:text-lg w-1/2 md:w-auto"
									placeholder="name@email.com"
								/> */}
								{/* <button
									id="footer-section"
									className="bg-white text-black font-sans hover:drop-shadow-lg p-2 md:p-3 lg:p-4 hover:bg-purple-500 hover:text-white font-semibold rounded-xl text-sm md:text-base lg:text-lg"
								>
									Get Started
								</button> */}
							</div>
						</div>
					</div>
					<div className="w-full py-12">
						<div className="container mx-auto px-6 lg:px-12">
							<div className="flex items-center justify-center mb-6">
								{/* <svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-white"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 00-2 0v3a1 1 0 001 1h2a1 1 0 100-2h-1V7z"
										clipRule="evenodd"
									/>
								</svg> */}
							</div>
							{/* <h2 className="text-3xl font-extrabold text-white text-center mb-6">
								Important Disclaimer
							</h2>
							<p className="text-lg text-white text-center leading-relaxed mb-4">
								We do not collect or ask for any personal
								financial information from our users. Our goal
								is to empower you with financial literacy and
								knowledge. While we offer general advice, we
								never provide specific investment
								recommendations or suggest how much to
								invest. Our focus is on creating a platform where
								people can ask questions and gain the
								understanding they need to make their own
								informed financial decisions
							</p> */}
						</div>
					</div>
				</div>
			</main>
			<div className="w-full h-full bg-black">
				<footer className="bg-black ">
					<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
						<div className="md:flex md:justify-between">
							<div className="mb-6 md:mb-0">
								<a
									href="/"
									className="flex items-center"
								>
									<img
										src="/logo.svg"
										className="h-20 me-3"
										alt="MediMitra Logo"
									/>
									<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
										MediMitra
									</span>
								</a>
							</div>
							<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
								<div>
									<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
										Resources
									</h2>
									<ul className="text-gray-500 dark:text-gray-400 font-medium">
										<li className="mb-4">
											<a
												href="/"
												className="hover:underline"
											>
												MediMitra
											</a>
										</li>
										<li>
											<a
												href="https://existence.technology/"
												className="hover:underline"
											>
												Existence Website
											</a>
										</li>
									</ul>
								</div>
								<div>
									<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
										Follow us
									</h2>
									<ul className="text-gray-500 dark:text-gray-400 font-medium">
										<li className="mb-4">
											<a
												href="https://github.com/existence-master"
												className="hover:underline"
											>
												Github
											</a>
										</li>
										<li>
											<a
												href="https://www.linkedin.com/company/existence-3/"
												className="hover:underline"
											>
												LinkedIn
											</a>
										</li>
									</ul>
								</div>
								<div>
									<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
										Legal
									</h2>
									<ul className="text-gray-500 dark:text-gray-400 font-medium">
										<li className="mb-4">
											<a
												href="#"
												className="hover:underline"
											>
												Privacy Policy
											</a>
										</li>
										<li>
											{/* <a
												href="#"
												className="hover:underline"
											>
												White Paper Link
											</a> */}
										</li>
									</ul>
								</div>
							</div>
						</div>
						<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
						<div className="sm:flex sm:items-center sm:justify-between">
							<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
								© 2024{" "}
								<a
									href="/"
									className="hover:underline"
								>
									MediMitra
								</a>
								. All Rights Reserved.
							</span>
							<div className="flex gap-8 mt-4 sm:justify-center sm:mt-0">
								<Image
									src="/x.svg"
									alt="X Icon"
									width={24}
									height={24}
									className="w-6 h-6 object-contain"
								/>
								<Image
									src="/linkedin.svg"
									alt="LinkedIn Icon"
									width={24}
									height={24}
									className="w-6 h-6 object-contain"
								/>
								<Image
									src="/youtube.svg"
									alt="YouTube Icon"
									width={24}
									height={24}
									className="w-6 h-6 object-contain"
								/>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
  );
}

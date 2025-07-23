import React from "react";
// Adjust the path as necessary
import LandImage from "../assets/LandImage.png";
import {
  FaTicketAlt,
  FaTasks,
  FaPhoneSquareAlt,
  FaEnvelope,
} from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import { FaSquarePollVertical } from "react-icons/fa6";
import { GrAnnounce } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <div className="flex sm:h-screen justify-between items-start md:items-center text-white text-xs sm:text-xl mt-20 sm:mt-0">
        <div className="w-1/2 flex flex-col justify-center items-center gap-3 sm:gap-8 px-1 sm:px-0">
          <h1 className="font-ptSerif text-lg sm:text-6xl text-yellow-400 text-outline text-center sm:text-left">
            Welcome to Cee Towers
          </h1>
          <p className="text-black text-xs sm:text-lg px-1 sm:pl-20 mx-auto font-ptSerif text-center sm:text-left">
            Manage your daily needs with ease book home services, raise
            maintenance requests, handle visitor passes, receive community
            updates, and send instant SOS alerts! <br /> All from one powerful
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 ">
            <button className="mt-2 sm:mt-4 bg-yellow-400 text-black px-3 sm:px-6 py-1 sm:py-2 rounded text-xs sm:text-base">
              Know More
            </button>
            <button
              className="mt-2 sm:mt-4 ml-2 sm:ml-4 bg-yellow-400 text-black px-3 sm:px-6 py-1 sm:py-2 rounded text-xs sm:text-base"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register Now
            </button>
          </div>
        </div>
        <div className="w-1/2 flex justify-end items-center px-1 sm:px-0">
          <img
            src={LandImage}
            alt="Society Image"
            className="w-4/5 sm:w-full max-w-[180px] sm:max-w-full object-contain"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center bg-gray-100 py-4 sm:py-8 mt-10 sm:mt-36">
        <div className="part1 w-11/12 sm:w-4/5">
          <h2 className="text-center text-base sm:text-2xl font-bold mt-4 sm:mt-8">
            Features
          </h2>
          <p className="text-black text-xs sm:text-lg max-w-2xl mx-auto">
            Manage your daily needs with ease! book home services, raise
            maintenance requests, handle visitor passes, receive community
            updates, and send instant SOS alerts! All from one powerful
            platform.
          </p>
        </div>
        <div className="part2 w-11/12 sm:w-4/5 flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4 sm:mt-6">
          <div className="col1 items-center justify-center flex flex-col w-full sm:w-1/2 gap-3 sm:gap-6">
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-2 sm:mb-4">
              <IoPeople className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold">
                  Home Services
                </h3>
                <p className="text-gray-700 text-xs sm:text-base">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-2 sm:mb-4">
              <GoAlertFill className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold">
                  Emergency SOS
                </h3>
                <p className="text-gray-700 text-xs sm:text-base">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-2 sm:mb-4">
              <FaSquarePollVertical className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold">
                  Polls & Voting
                </h3>
                <p className="text-gray-700 text-xs sm:text-base">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
          </div>
          <div className="col2 items-center justify-center flex flex-col w-full sm:w-1/2 gap-3 sm:gap-6">
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-2 sm:mb-4">
              <FaTicketAlt className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold">
                  Digital Gatepass
                </h3>
                <p className="text-gray-700 text-xs sm:text-base">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-2 sm:mb-4">
              <GrAnnounce className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold">
                  Community Announcements
                </h3>
                <p className="text-gray-700 text-xs sm:text-base">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-2 sm:mb-4">
              <FaTasks className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold">
                  Task Management
                </h3>
                <p className="text-gray-700 text-xs sm:text-base">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer bg-black w-full flex justify-center items-center py-4 sm:py-10 border-t border-gray-800 mt-4">
        <div className="w-11/12 sm:w-3/4 flex sm:flex-row justify-start items-start sm:items-start gap-2 sm:gap-10">
          <div className="w-full sm:w-1/3 flex flex-col justify-start items-start sm:items-start text-white mb-2 sm:mb-0 text-center sm:text-left text-xs sm:text-base">
            <h1 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2">
              Cee Towers
            </h1>
            <p className="text-[10px] sm:text-base text-start">
              Cee Towers is a modern residential complex located in the heart of
              the city. It is a 10-storey building with 100 units.
            </p>
          </div>
          <div className="w-full sm:w-1/3 flex flex-col justify-center items-start sm:items-start text-white mb-2 sm:mb-0 text-center sm:text-left text-xs sm:text-base">
            <h1 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2 text-start">
              Quick Links
            </h1>
            <ul className="text-xs sm:text-base flex flex-col gap-1 text-start justify-start items-start">
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="w-full sm:w-1/3 flex flex-col justify-center items-start sm:items-start text-white text-center sm:text-left text-xs sm:text-base">
            <h1 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2">
              Contact Us
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start text-xs sm:text-base mb-1">
              <FaPhoneSquareAlt />
              <p>+91 9884580300</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start text-xs sm:text-base">
              <FaEnvelope />
              <p>info@ceetowers.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

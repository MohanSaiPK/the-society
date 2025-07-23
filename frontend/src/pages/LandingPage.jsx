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
      <div className="flex sm:h-screen justify-center items-start md:items-center mt-20 sm:mt-0">
        <div className="w-1/2 flex flex-col justify-center items-center gap-3 sm:gap-8 px-1 sm:px-0">
          <h1 className="font-ptSerif text-lg sm:text-6xl text-yellow-400 text-outline text-center sm:text-left">
            Welcome to Cee Towers
          </h1>
          <p className="text-black text-xs sm:text-lg px-1 sm:pl-20 mx-auto font-ptSerif text-left pl-6 sm:text-left">
            Experience a new era of community living. Cee Towers empowers
            residents, staff, and management to connect, collaborate, and manage
            daily life with ease. Enjoy seamless digital services, instant
            communication, and a safer, smarter society!
            <br /> All in one place.
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
        <div className="w-1/2 flex justify-end min-h-[400px] items-center px-1 sm:px-0">
          <img
            src={LandImage}
            alt="Society Image"
            className="w-full  sm:max-w-full object-contain "
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center bg-gray-100 pb-4 sm:py-8 sm:mt-36">
        <div className="part1 w-11/12 sm:w-4/5 flex flex-col items-center justify-center mb-4">
          <h2 className="text-center text-base sm:text-2xl font-bold mt-4 sm:mt-8 font-ptSerif">
            Features
          </h2>
          <p className="text-black text-xs sm:text-lg max-w-3xs sm:max-w-3xl mx-auto font-ptSerif text-center sm:text-left">
            Effortlessly manage every aspect of society life with powerful
            digital tools for residents, staff, and management. All in one
            platform.
          </p>
        </div>
        <div className="part2 w-11/12 sm:w-4/5 flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4 sm:mt-8">
          <div className="col1 flex flex-col w-full sm:w-1/2 gap-3 sm:gap-8">
            <div className="flex items-start justify-center w-full gap-4 sm:gap-8 mb-2 sm:mb-4">
              <IoPeople className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold font-ptSerif">
                  Home Services
                </h3>
                <p className="text-gray-700 text-xs sm:text-base font-ptSerif font-light">
                  Book trusted service providers for plumbing, electrical,
                  cleaning, and more right from your dashboard. Enjoy
                  hassle-free scheduling and real-time updates on your requests.
                </p>
              </div>
            </div>
            <div className="flex items-start justify-center w-full gap-4  mb-2 sm:mb-4">
              <GoAlertFill className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold font-ptSerif">
                  Emergency SOS
                </h3>
                <p className="text-gray-700 text-xs sm:text-base font-ptSerif font-light">
                  Instantly alert security and neighbors in case of medical,
                  fire, or security emergencies. Your location and details are
                  shared in real-time for rapid response and peace of mind.
                </p>
              </div>
            </div>
            <div className="flex items-start justify-center w-full gap-4  mb-2 sm:mb-4">
              <FaSquarePollVertical className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold font-ptSerif">
                  Polls & Voting
                </h3>
                <p className="text-gray-700 text-xs sm:text-base font-ptSerif font-light">
                  Participate in community decisions with secure, transparent
                  polls. Cast your vote on important issues and see results
                  instantly. Your voice matters in shaping society policies.
                </p>
              </div>
            </div>
          </div>
          <div className="col2 flex flex-col w-full sm:w-1/2 gap-3 sm:gap-8">
            <div className="flex items-start justify-center w-full gap-4  mb-2 sm:mb-4">
              <FaTicketAlt className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold font-ptSerif">
                  Digital Gatepass
                </h3>
                <p className="text-gray-700 text-xs sm:text-base font-ptSerif font-light">
                  Generate digital gatepasses for visitors and deliveries.
                  Guards can verify, approve, and log entries in real-time,
                  ensuring security and convenience for all residents.
                </p>
              </div>
            </div>
            <div className="flex items-start justify-center w-full gap-4  mb-2 sm:mb-4">
              <GrAnnounce className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold font-ptSerif">
                  Community Announcements
                </h3>
                <p className="text-gray-700 text-xs sm:text-base font-ptSerif font-light">
                  Stay updated with instant announcements from management.
                  Receive important notices, event updates, and reminders
                  directly on your dashboard and via notifications.
                </p>
              </div>
            </div>
            <div className="flex items-start justify-center w-full gap-4  mb-2 sm:mb-4">
              <FaTasks className="text-yellow-400 w-6 h-6 sm:w-10 sm:h-10" />
              <div className="desc w-2/3 flex flex-col justify-center items-start">
                <h3 className="text-xs sm:text-lg font-semibold font-ptSerif">
                  Task Management
                </h3>
                <p className="text-gray-700 text-xs sm:text-base font-ptSerif font-light">
                  Assign, track, and complete society-related tasks efficiently.
                  Management and staff can collaborate, set deadlines, and
                  monitor progress for smooth operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer bg-black w-full flex justify-center items-center py-4 sm:py-10 border-t border-gray-800 mt-4">
        <div className="w-11/12 sm:w-3/4 flex sm:flex-row justify-start items-start sm:items-start gap-2 sm:gap-10">
          <div className="w-full sm:w-1/3 flex flex-col justify-start items-start sm:items-start text-white mb-2 sm:mb-0 text-center sm:text-left text-xs sm:text-base">
            <h1 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2 font-ptSerif">
              Cee Towers
            </h1>
            <p className="text-[10px] sm:text-base text-start font-ptSerif font-light">
              All your society needs, managed digitally in one seamless
              platform.
            </p>
          </div>
          <div className="w-full sm:w-1/3 flex flex-col justify-center items-start sm:items-start text-white mb-2 sm:mb-0 text-center sm:text-left text-xs sm:text-base">
            <h1 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2 text-start font-ptSerif">
              Quick Links
            </h1>
            <ul className="text-xs sm:text-base flex flex-col gap-1 text-start justify-start items-start font-ptSerif font-light">
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="w-full sm:w-1/3 flex flex-col justify-center items-start sm:items-start text-white text-center sm:text-left text-xs sm:text-base">
            <h1 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2 font-ptSerif">
              Contact Us
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start text-xs sm:text-base mb-1 font-ptSerif font-light">
              <FaPhoneSquareAlt />
              <p>+91 9884580300</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start text-xs sm:text-base font-ptSerif font-light">
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

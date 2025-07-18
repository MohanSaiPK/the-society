import React from "react";
// Adjust the path as necessary
import LandImage from "../assets/Landimage.png";
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
    <>
      <div className="flex h-screen justify-between bg-red-500 text-white text-xl">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <h1>Welcome to Cee Towers</h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Manage your daily needs with ease — book home services, raise
            maintenance requests, handle visitor passes, receive community
            updates, and send instant SOS alerts! All from one powerful
            platform.
          </p>
          <div>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
              Know More
            </button>
            <button
              className="mt-4 ml-4 bg-blue-600 text-white px-6 py-2 rounded"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register Now
            </button>
          </div>
        </div>
        <div className="w-1/2 flex justify-right ">
          <img
            src={LandImage}
            alt="Society Image"
            className="w-full  justify-right"
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center bg-gray-100 py-8 items-between">
        <div className="part1 w-4/5">
          <h2 className="text-center text-2xl font-bold mt-8">Features</h2>
          <p className="text-black text-lg max-w-2xl mx-auto">
            Manage your daily needs with ease! book home services, raise
            maintenance requests, handle visitor passes, receive community
            updates, and send instant SOS alerts! All from one powerful
            platform.
          </p>
        </div>
        <div className="part2 w-4/5 flex ">
          <div className="col1 items-center justify-center flex flex-col w-1/2">
            <div className=" flex items-center justify-center ">
              <IoPeople />
              <div className="desc w-2/3">
                <h3 className="text-lg font-semibold">Home Services</h3>
                <p className="text-gray-700 ">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className=" flex items-center justify-center ">
              <GoAlertFill />
              <div className="desc w-2/3">
                <h3 className="text-lg font-semibold">Emergency SOS</h3>
                <p className="text-gray-700 ">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className=" flex items-center justify-center ">
              <FaSquarePollVertical />
              <div className="desc w-2/3">
                <h3 className="text-lg font-semibold">Polls & Voting</h3>
                <p className="text-gray-700 ">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
          </div>
          <div className="col2 items-center justify-center flex flex-col w-1/2">
            <div className=" flex items-center justify-center ">
              <FaTicketAlt />
              <div className="desc w-2/3">
                <h3 className="text-lg font-semibold">Digital Gatepass</h3>
                <p className="text-gray-700 ">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className=" flex items-center justify-center ">
              <GrAnnounce />
              <div className="desc w-2/3">
                <h3 className="text-lg font-semibold">
                  Community Announcements
                </h3>
                <p className="text-gray-700 ">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
            <div className=" flex items-center justify-center ">
              <FaTasks />
              <div className="desc w-2/3">
                <h3 className="text-lg font-semibold">Task Management</h3>
                <p className="text-gray-700 ">
                  Log complaints, track their progress, and communicate
                  seamlessly with management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer bg-black w-full flex justify-center items-center py-10">
        <div className="w-3/4 flex justify-between items-center gap-10">
          <div className="w-1/3 flex flex-col justify-start items-left text-white">
            <h1>Cee Towers</h1>
            <p>
              Cee Towers is a modern residential complex located in the heart of
              the city. It is a 10-storey building with 100 units.
            </p>
          </div>
          <div className="w-1/3 justify-between items-center text-white">
            <h1>Quick Links</h1>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="w-1/3 justify-between items-center text-white">
            <h1>Contact Us</h1>
            <div className="flex items-center gap-2">
              <FaPhoneSquareAlt />
              <p>+91 9884580300</p>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope />
              <p>info@ceetowers.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

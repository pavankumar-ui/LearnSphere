import React from "react";
import { assets } from "../../assets/assets/assets";

const Footer = () => {
  return (
    <footer className="bg-cyan-100/70 md:px-36 text-left text-black w-full mt-10">
      <div
        className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 
                   md:gap-32 py-10 border-b border-black/30"
      >
        <div className="flex flex-col md:items-start items-center w-full">
          <img
            src={assets.logo}
            alt="logo"
            className="w-20 h-20 md:w-24 h-15"
          />
          <p className="mt-6 text-center md:text-left text-sm text-black/80">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            voluptatem sunt animi, itaque vitae est vel quaerat incidunt sequi.
            Laboriosam in ex blanditiis consequuntur tempore eveniet iure
            aliquid cupiditate culpa.
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm md:space-y-2">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              {" "}
              <a href="#">About Us</a>
            </li>
            <li>
              {" "}
              <a href="#">Contact Us</a>
            </li>
            <li>
              {" "}
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start items-center w-full">
          <h2 className="font-semibold mb-5">Subscribe to our Newsletter</h2>
          <p className="text-sm text-gray-700">
            The latest news articles and resources, send to your inbox weekly{" "}
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="enter your email"
              className="border border-gray-700/30 bg-white text-gray-700 placeholder-gray-700 
                outline-none w-64 h-10 rounded px-2 text-sm"
            />
            <button className="bg-blue-600 w-24 h-10 text-white rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-gray-800/80">
        copyright 2025 &copy; LearnSphere All Right reserved
      </p>
    </footer>
  );
};

export default Footer;

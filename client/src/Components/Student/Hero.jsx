import React from "react";
import { assets } from "../../assets/assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 
        md:px-0 space-y-7 text-center bg-gradient-to-l from-blue-950/50"
    >
      <h1
        className="md:text-home-heading-large text-home-heading-small
       relative font-bold text-white max-w-3xl mx-auto"
      >
        Learn Sphere Online Learning Platform to unleash the skills by upgrading
        <span className="text-blue-600"> 10x better knowledge.</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
        We bring together world class instructors,interactive content and a
        supportive community to help you achieve your personal and professional
        goals.
      </p>

      {/* mobile view */}
      <p className="md:hidden text-gray-500 max-w-sm mx-auto">
        We bring together world class instructors,interactive content and a
        supportive community to help you achieve your personal and professional
        goals.
      </p>
      <SearchBar />
    </div>
  );
};

export default Hero;

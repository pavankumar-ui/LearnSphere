import React from "react";
import { assets } from "../../assets/assets/assets";

const CalltoAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl text-gray-300 font-semibold">
        Learn anything, anywhere, anytime
      </h1>
      <p className="text-gray-400 sm:text-sm">
        {" "}
        Never quit learning until you get something,thrive to be least One. Aim
        for the next battle of curves in corporate world
      </p>
      <div className="flex items-center font-medium gap-6 mt-5">
        <button className="px-10 py-3 rounded-md text-white bg-blue-600">
          Get Started
        </button>
        <button className="flex items-center gap-2 text-gray-400">
          Learn More
          <img
            src={assets.arrow_icon}
            alt="arrow_icon"
            className="w-4 text-white md:w-5"
          />
        </button>
      </div>
    </div>
  );
};

export default CalltoAction;

import Link from "next/link";
import React from "react";
import { MdFavorite } from "react-icons/md";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-inner mt-16">
      {" "}
      {/* Matched gradient to header, added inner shadow, and increased top margin for separation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {" "}
        {/* Increased vertical padding */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-6 md:space-y-0">
          {" "}
          {/* Improved responsiveness and alignment */}
          {/* Copyright Information */}
          <div className="text-gray-400 text-sm md:text-base">
            {" "}
            {/* Adjusted text size for responsiveness */}©{" "}
            {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">Fast Scropper</span>. All
            rights reserved.
          </div>
          {/* Made with Love Section */}
          <div className="flex items-center space-x-2 text-gray-400 text-sm md:text-base">
            {" "}
            {/* Consistent text size */}
            <span>Crafted with</span>
            <MdFavorite className="h-5 w-5 text-red-500 animate-pulse-slow" />{" "}
            {/* Slightly increased heart size, slower pulse */}
            <span>by</span>
            <Link
              className="text-white hover:text-blue-300 font-medium underline underline-offset-4 transition-colors duration-300" // Enhanced link styling
              href={"https://abbasali.cm"}
              target="_blank" //
              rel="noopener noreferrer"
            >
              Abba Sali
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

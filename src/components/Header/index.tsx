import Link from "next/link";
import React from "react";
import { FaCamera, FaStar, FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-lg">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {" "}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg opacity-75 animate-pulse"></div>{" "}
              <div className="relative bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300">
                {" "}
                <FaCamera className="h-6 w-6 lg:h-8 lg:w-8 text-white" />{" "}
              </div>
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent tracking-tight">
                {" "}
                Fast Scropper
              </h1>
              <p className="hidden md:flex text-sm text-blue-200 opacity-80 mt-0.5">
                {" "}
                Professional Image Cropping Tool
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
            {" "}
            <div className="hidden sm:flex items-center space-x-2 text-sm font-medium text-blue-300">
              {" "}
              <FaStar className="h-4 w-4 text-yellow-400" />{" "}
              <span>Free & Unlimited</span>
            </div>
            <Link
              href="https://github.com/Asam237"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <FaGithub className="h-7 w-7 text-white hover:text-gray-400 transition-colors duration-200" />{" "}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

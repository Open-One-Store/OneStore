import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const { authToken } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 z-[100] w-full">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">OneStore</div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
        <div className={`md:flex items-center ${isOpen ? "block" : "hidden"}`}>
          <a href="/" className="block mt-4 md:inline-block md:mt-0 mr-6">
            Home
          </a>
          <a
            href="#features"
            className="block mt-4 md:inline-block md:mt-0 mr-6"
          >
            Features
          </a>
          {authToken ? (
            <a href="/dashbord" className="block mt-4 md:inline-block md:mt-0">
              Dashboard
            </a>
          ) : (
            <a href="/login" className="block mt-4 md:inline-block md:mt-0">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

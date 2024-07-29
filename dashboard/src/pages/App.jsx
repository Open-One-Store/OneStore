import {
  FaAndroid,
  FaCloud,
  FaCodeBranch,
  FaGithub,
  FaMagic,
  FaSync,
  FaTachometerAlt,
} from "react-icons/fa";
import "./App.css";
import Contributors from "../components/Contributors";

export default function App() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-2">Welcome to OneStore</h1>
          <p className="text-2xl mb-8">
            Save from anywhere, access from one place.
          </p>
          <a
            href="https://github.com/Open-One-Store/OneStore"
            target="_blank"
            className="bg-white inline-flex mx-3 text-blue-600 font-bold py-2 px-4 rounded-full"
          >
            <FaGithub className="w-6 h-6 inline-block mr-2" />
            Source Code
          </a>
          <a
            href="/dashboard"
            className="bg-white inline-flex mx-3 text-blue-600 font-bold py-2 px-4 rounded-full"
          >
            <FaTachometerAlt className="w-6 h-6 inline-block mr-2" />
            Go to Dashboard
          </a>
        </div>
      </section>

      {/* Download Section */}
      <section className=" text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Download the App</h2>
          <a
            href="https://github.com/Open-One-Store/OneStore/releases/tag/mobile_app"
            target="_blank"
            className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full"
          >
            <FaAndroid className="w-6 h-6 inline-block mr-2" />
            Android
          </a>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-justify">
          <h2 className="text-4xl font-bold mb-8 text-center">Why OneStore?</h2>
          <p className="text-lg mb-8">
            In today&apos;s digital age, users are constantly inundated with an
            overwhelming amount of content spanning across multiple devices and
            platforms. Managing and organizing these files, videos, links, and
            other digital assets can be cumbersome and inefficient. Users often
            find themselves juggling between different storage solutions,
            leading to fragmented data and wasted time searching for important
            information. The lack of a unified system to save and access content
            seamlessly across various devices poses a significant challenge for
            productivity and organization.
            <br />
            <br />
            <strong>OneStore</strong> is a Free and Open Source Software (FOSS)
            based on the Apache-2.0 License designed to revolutionize the way
            users save and access their digital content. It enables users to
            effortlessly save files, videos, links, and other sharable items
            from any device or platform to a single, unified drive location,
            ensuring easy and organized access anywhere, anytime.
          </p>
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full"
            >
              <FaTachometerAlt className="w-6 h-6 inline-block mr-2" />
              Go to Dashboard
            </a>
            <a
              href="https://github.com/Open-One-Store/OneStore"
              className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full"
            >
              <FaGithub className="w-6 h-6 inline-block mr-2" />
              Source Code
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-5">
            <div className="w-full mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <FaCloud className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl text-black font-bold mb-2">
                  Unified Storage
                </h3>
                <p className="text-gray-600">
                  All your content in one place for easy access and management.
                </p>
              </div>
            </div>
            <div className="w-full mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <FaSync className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl text-black font-bold mb-2">
                  Seamless Integration
                </h3>
                <p className="text-gray-600">
                  Works smoothly across all your devices and platforms.
                </p>
              </div>
            </div>
            <div className="w-full mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <FaMagic className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl text-black font-bold mb-2">
                  User-Friendly Interface
                </h3>
                <p className="text-gray-600">
                  Intuitive design ensures a smooth and pleasant experience.
                </p>
              </div>
            </div>
            <div className="w-full mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <FaCodeBranch className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl text-black font-bold mb-2">
                  Open Source
                </h3>
                <p className="text-gray-600">
                  Free and open-source software with a Apache-2.0 License.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" text-black py-20">
        <Contributors />
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Get Started with OneStore Today
          </h2>
          <a
            href="/dashboard"
            className="bg-white inline-flex text-blue-600 font-bold py-2 px-4 rounded-full mx-3"
          >
            <FaTachometerAlt className="w-6 h-6 inline-block mr-2" />
            Go to Dashboard
          </a>
          <a
            href="https://github.com/Open-One-Store/OneStore"
            target="_blank"
            className="bg-white inline-flex text-blue-600 font-bold py-2 px-4 rounded-full mx-3"
          >
            <FaGithub className="w-6 h-6 inline-block mr-2" />
            Source Code
          </a>
        </div>
      </section>
    </div>
  );
}

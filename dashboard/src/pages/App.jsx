import "./App.css";

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
            href="#features"
            className="bg-white mx-3 text-blue-600 font-bold py-2 px-4 rounded-full"
          >
            Learn More
          </a>
          <a
            href="/dashboard"
            className="bg-white mx-3 text-blue-600 font-bold py-2 px-4 rounded-full"
          >
            Go to Dashboard
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="flex flex-wrap -mx-6">
            <div className="w-full md:w-1/3 px-6 mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <svg
                  className="w-16 h-16 text-blue-600 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 018 8v1h1a2 2 0 012 2v2a2 2 0 01-2 2h-2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1H6a2 2 0 01-2-2v-2a2 2 0 012-2h1v-1a8 8 0 018-8zM8 9v1H6a1 1 0 00-1 1v2a1 1 0 001 1h2v1a1 1 0 001 1h4a1 1 0 001-1v-1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2V9a6 6 0 00-12 0z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">Unified Storage</h3>
                <p className="text-gray-600">
                  All your content in one place for easy access and management.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-6 mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <svg
                  className="w-16 h-16 text-blue-600 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 018 8v1h1a2 2 0 012 2v2a2 2 0 01-2 2h-2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1H6a2 2 0 01-2-2v-2a2 2 0 012-2h1v-1a8 8 0 018-8zM8 9v1H6a1 1 0 00-1 1v2a1 1 0 001 1h2v1a1 1 0 001 1h4a1 1 0 001-1v-1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2V9a6 6 0 00-12 0z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">
                  Seamless Integration
                </h3>
                <p className="text-gray-600">
                  Works smoothly across all your devices and platforms.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-6 mb-12 md:mb-0">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <svg
                  className="w-16 h-16 text-blue-600 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 018 8v1h1a2 2 0 012 2v2a2 2 0 01-2 2h-2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1H6a2 2 0 01-2-2v-2a2 2 0 012-2h1v-1a8 8 0 018-8zM8 9v1H6a1 1 0 00-1 1v2a1 1 0 001 1h2v1a1 1 0 001 1h4a1 1 0 001-1v-1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2V9a6 6 0 00-12 0z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">
                  User-Friendly Interface
                </h3>
                <p className="text-gray-600">
                  Intuitive design ensures a smooth and pleasant experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Get Started with OneStore Today
          </h2>
          <a
            href="/dashboard"
            className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full"
          >
            Go to Dashboard
          </a>
        </div>
      </section>
    </div>
  );
}

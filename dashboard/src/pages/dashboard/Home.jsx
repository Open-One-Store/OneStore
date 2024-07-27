export default function DashboardHome() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Home</h1>
      <p>Welcome back to OneStore</p>
      <div className="mt-4 p-3">
        <input
          type="search"
          placeholder="Search for items"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
        />
      </div>
      <div className="mt-4 p-3 rounded-lg ring-1 ring-white/50">
        <h2 className="text-2xl font-bold">Recent Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 overflow-x-scroll gap-4 mt-4">
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Item 1</h3>
            <p className="text-gray-300 mt-2">Description of item 1</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Item 2</h3>
            <p className="text-gray-300 mt-2">Description of item 2</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Item 3</h3>
            <p className="text-gray-300 mt-2">Description of item 3</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Item 3</h3>
            <p className="text-gray-300 mt-2">Description of item 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

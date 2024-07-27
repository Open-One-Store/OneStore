import { FaHome } from "react-icons/fa";
import { FaBoxArchive, FaCloudArrowUp, FaGear } from "react-icons/fa6";
export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-6 h-full w-full bg-gray-800 text-white p-4 overflow-hidden">
      <h1 className="text-3xl font-bold text-center my-3">Dashboard</h1>
      <button className="flex items-center justify-center text-xl py-2 px-4 rounded-full hover:bg-gray-700 ring-1 ring-gray-700">
        <FaCloudArrowUp className="mr-2" />
        Upload
      </button>
      <nav>
        <a
          href="/dashboard"
          className="text-xl flex items-center py-2 px-4 rounded hover:bg-gray-700"
        >
          <FaHome className="mr-2" />
          Home
        </a>
        <a
          href="/dashboard/items"
          className="text-xl flex items-center py-2 px-4 rounded hover:bg-gray-700"
        >
          <FaBoxArchive className="mr-2" />
          All Items
        </a>
        <a
          href="#"
          className="text-xl flex items-center py-2 px-4 rounded hover:bg-gray-700"
        >
          <FaGear className="mr-2" />
          Settings
        </a>
      </nav>
    </aside>
  );
}

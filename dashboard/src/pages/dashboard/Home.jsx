import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHome() {
  const { authToken } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const { data: items } = useQuery({
    queryKey: ["items", search],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/items?limit=6${
          search !== "" ? `&search=${search}` : ""
        }&orderBy=updatedAt&orderDirection=desc`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Home</h1>
      <p>Welcome back to OneStore</p>
      <div className="mt-4 p-3">
        <input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search for items"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
        />
      </div>
      <div className="mt-4 p-3 rounded-lg ring-1 ring-white/50">
        <h2 className="text-2xl font-bold">Recent Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 overflow-x-scroll gap-4 mt-4">
          {items?.map((item) => (
            <a
              href={`/dashboard/items/${item.id}`}
              key={item.id}
              className="bg-gray-700 rounded-lg p-4 shadow-lg flex flex-col hover:bg-gray-800 transition-all duration-200"
            >
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

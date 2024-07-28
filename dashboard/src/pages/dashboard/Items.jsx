import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { getItemIcon } from "../../utils/getItemIcon";
import timeAgo from "../../utils/timeAgo";

export default function Items() {
  const { authToken } = useContext(AuthContext);
  const searchparams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState(searchparams["tag"] || "");
  // eslint-disable-next-line no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState(
    searchparams[0].get("category") || ""
  );
  console.log(searchparams[0].get("category"));
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/categories`,
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
  const { data: items } = useQuery({
    queryKey: ["items", search, selectedTag],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/items?${
          search !== "" ? `&search=${search}` : ""
        }${selectedTag !== "" ? `&tagId=${selectedTag}` : ""}${
          selectedCategory !== "" ? `&categoryId=${selectedCategory}` : ""
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
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/tags`,
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
      <h1 className="text-3xl font-bold">All Items</h1>
      <p>View all items in your vault</p>
      <div className="mt-4 p-3">
        <input
          type="search"
          placeholder="Search for items"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mt-4 p-3">
        {/* Breadcrumb */}
        <a href="/dashboard/items" className="text-blue-500 hover:underline">
          Home
        </a>
        <span className="mx-2">/</span>
        {selectedCategory && (
          <>
            <a
              href={`/dashboard/items?category=${selectedCategory}`}
              className="text-blue-500 hover:underline"
            >
              {categories?.find((c) => c.id === selectedCategory)?.name}
            </a>
            <span className="mx-2">/</span>
          </>
        )}
      </div>
      <div className="mt-4 p-3">
        <h2 className="text-2xl font-bold">Tags</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags?.map((tag) => (
            <span
              key={tag.id}
              className={`bg-gray-700 p-2 px-5 rounded-full cursor-pointer ${
                selectedTag === tag.id && "bg-blue-500"
              }`}
              onClick={() => {
                selectedTag === tag.id
                  ? setSelectedTag("")
                  : setSelectedTag(tag.id);
              }}
            >
              {tag.name}
            </span>
          ))}
          <a href="/dashboard/tags/add">
            <button className="bg-gray-700 p-2 px-5 rounded-full hover:bg-blue-500">
              +
            </button>
          </a>
          {!tags && <p>Loading...</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 overflow-x-scroll gap-4 mt-4">
        {!selectedCategory &&
          categories?.map((category) => (
            <a
              href={`/dashboard/items?category=${category.id}`}
              key={category.id}
              className="bg-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-200"
            >
              <FaFolder className="text-4xl text-gray-300 my-2" />
              <h3 className="text-xl font-bold">{category.name}</h3>
            </a>
          ))}
        {items?.map(
          (item) =>
            (selectedCategory === item.categoryId || !item.categoryId) && (
              <a
                href={`/dashboard/items/${item.id}`}
                key={item.id}
                className="bg-gray-700 p-4 rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-200"
              >
                {getItemIcon(item.itemType)}
                <h3 className="text-xl font-bold">{item.title}</h3>
                <small className="text-gray-400">
                  {timeAgo(new Date(item.updatedAt))}
                </small>
              </a>
            )
        )}
        {!items && <p>Loading...</p>}
        {items && items.length === 0 && (
          <p className="text-center md:col-span-3">No items found</p>
        )}
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import React from "react";
import Select from "react-select";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddItems() {
  const [selectedType, setSelectedType] = React.useState(null);
  const { authToken } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const options = [
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "file", label: "File" },
    { value: "text", label: "Text" },
    { value: "link", label: "Link" },
    { value: "other", label: "Other" },
  ];
  const { data: categories } = useQuery({
    queryKey: "categories",
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return await response.json();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.get("title"));
    fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/dashboard/items");
      });
  };
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Upload Item</h1>
      <p>Upload a new Item</p>
      <form className="mt-4 p-3 space-y-3" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter Item Name"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Enter Item Description"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
        />
        <label htmlFor="categoryId">Category</label>
        <Select
          options={categories?.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          name="categoryId"
          id="categoryId"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 text-black"
        />
        <label htmlFor="itemType">Item Type</label>
        <Select
          options={options}
          name="itemType"
          id="itemType"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 text-black"
          onChange={(e) => setSelectedType(e.value)}
        />
        {(selectedType === "image" ||
          selectedType === "file" ||
          selectedType === "video") && (
          <>
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              name="file"
              placeholder="Upload Image"
              className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
            />
          </>
        )}
        {(selectedType === "link" || selectedType === "other") && (
          <>
            <label htmlFor="link">Enter URL</label>
            <input
              type="url"
              name="link"
              placeholder="Enter URL"
              className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
            />
          </>
        )}
        {selectedType === "text" && (
          <>
            <label htmlFor="text">Enter Text</label>
            <textarea
              name="text"
              placeholder="Enter Text"
              className="w-full p-2 px-5 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
            ></textarea>
          </>
        )}
        <button className="w-full bg-blue-500 text-white p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          Upload
        </button>
      </form>
    </div>
  );
}

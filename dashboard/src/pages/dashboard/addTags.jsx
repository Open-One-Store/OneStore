import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddTags() {
  const { authToken } = useContext(AuthContext);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const addTag = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_URL}/tags`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: name }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    setName("");
    navigate("/dashboard/items");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Add New Tag</h1>
      <p>Add a new tag</p>
      <div className="mt-4 p-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter tag name"
          className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
        />
      </div>
      <button
        className="mt-4 w-full bg-blue-500 text-white p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={addTag}
      >
        Add Tag
      </button>
    </div>
  );
}

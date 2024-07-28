import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import TagSelection from "../../components/TagSelection";

export default function ItemData() {
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");

  const { id } = useParams();
  const { authToken } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTag && selectedTag !== "") {
      fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/items/${id}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ tagId: selectedTag }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        queryClient.invalidateQueries(["item", id]);
      });
    }
  }, [selectedTag, authToken, id, queryClient]);
  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSelectedTag("");
      return response.json();
    },
  });

  const handleRemoveTag = (tagID) => {
    fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/items/${id}/tags/${tagID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ tagId: selectedTag }),
    }).then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }
      queryClient.invalidateQueries(["item", id]);
    });
  };

  const handleDelete = () => {
    confirm("Are you sure you want to delete this item?") &&
      fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        queryClient.invalidateQueries(["items"]);
        navigate(`/dashboard/items`);
      });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Item Information</h1>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p>{item.description}</p>
      <div className="flex items-center mt-4 mb-5">
        {/* Breadcrumbs */}
        <a href="/dashboard/items" className="text-blue-500 hover:underline">
          Home
        </a>
        <span className="mx-2">/</span>
        {item.Category && (
          <>
            <a
              href={`/dashboard/items?category=${item.categoryId}`}
              className="text-blue-500 hover:underline"
            >
              {item.Category.name}
            </a>
            <span className="mx-2">/</span>
          </>
        )}
        <span>{item.title}</span>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col p-5 ring-1 ring-white/50 min-h-[50vh] rounded-lg">
          <h2 className="text-2xl font-bold mb-3 capitalize">
            {item.itemType}
          </h2>
          {item.itemType === "image" && (
            <img
              src={item.fileUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
          {item.itemType === "video" && (
            <video
              className="h-full w-full rounded-lg"
              autoPlay
              muted
              controls
              loop
            >
              <source src={item.fileUrl} />
            </video>
          )}
          {item.itemType === "text" && (
            <textarea readOnly className="w-full h-full">
              {item.text}
            </textarea>
          )}
          {item.itemType === "link" && (
            <a href={item.url} className="text-blue-500 hover:underline">
              {item.url}
            </a>
          )}
          {item.itemType === "file" && (
            <embed src={item.fileUrl} className="w-full h-full" />
          )}
        </div>
        <div className="p-5">
          <h2 className="text-2xl font-bold">{item.title}</h2>
          <p>{item.description}</p>
          {item.Category && (
            <p>
              <strong>Category:</strong> {item.Category?.name}
            </p>
          )}
          <p>
            <strong>Uploaded At:</strong>{" "}
            {new Date(item.createdAt).toDateString()}
          </p>

          <div className="mt-4">
            <h3 className="text-xl font-bold">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags?.map((tag) => (
                <span
                  key={tag.id}
                  onClick={() => {
                    handleRemoveTag(tag.id);
                  }}
                  className="bg-gray-700 font-semibold p-2 px-5 rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
                >
                  {tag.name}
                </span>
              ))}
              <button
                className="bg-gray-700 text-white p-2 px-5 rounded-full"
                onClick={() => setShowTagMenu(!showTagMenu)}
              >
                +
              </button>
              {showTagMenu && (
                <TagSelection
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  setSelectTagShow={setShowTagMenu}
                />
              )}
            </div>
          </div>
          <button
            className="mt-4 w-full bg-red-500 text-white p-2 px-5 rounded-full"
            onClick={handleDelete}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}

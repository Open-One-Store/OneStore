import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PropTypes from "prop-types";

export default function TagSelection({
  selectedTag,
  setSelectedTag,
  setSelectTagShow,
}) {
  const { authToken } = useContext(AuthContext);
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
      return await response.json();
    },
  });
  return (
    <div className="mt-4 p-3">
      <select
        className="w-full p-2 px-5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedTag}
        onChange={(e) => {
          setSelectedTag(e.target.value);
          setSelectTagShow(false);
        }}
      >
        <option value="">All Tags</option>
        {tags?.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
}

TagSelection.propTypes = {
  selectedTag: PropTypes.string,
  setSelectedTag: PropTypes.func,
  setSelectTagShow: PropTypes.func,
};

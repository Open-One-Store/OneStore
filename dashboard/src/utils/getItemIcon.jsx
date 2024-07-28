import { FaImage, FaVideo, FaFile, FaStickyNote, FaLink } from "react-icons/fa";

export const getItemIcon = (type) => {
  switch (type) {
    case "image":
      return <FaImage className="text-4xl text-gray-300 my-2" />;
    case "video":
      return <FaVideo className="text-4xl text-gray-300 my-2" />;
    case "file":
      return <FaFile className="text-4xl text-gray-300 my-2" />;
    case "text":
      return <FaStickyNote className="text-4xl text-gray-300 my-2 " />;
    case "link":
      return <FaLink className="text-4xl text-gray-300 my-2" />;
    default:
      return <FaFile className="text-4xl text-gray-300 my-2" />;
  }
};

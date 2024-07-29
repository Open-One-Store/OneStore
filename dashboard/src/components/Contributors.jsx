import { useEffect, useState } from "react";

const Contributors = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/Open-One-Store/OneStore/contributors`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-white">
        Contributors
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full items-center">
        {contributors.map((contributor) => (
          <a
            key={contributor.id}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col w-full items-center p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="w-20 h-20 rounded-full mb-2"
            />
            <span className="text-sm font-medium">{contributor.login}</span>
            <span className="text-xs text-gray-500">
              Contributions: {contributor.contributions}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contributors;

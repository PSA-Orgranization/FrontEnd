import React from "react";

const DotLoader: React.FC = () => (
  <span className="inline-flex space-x-1">
    <span
      className="w-2 h-2 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 animate-pulse"
      style={{ animationDelay: "0ms" }}
    />
    <span
      className="w-2 h-2 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 animate-pulse"
      style={{ animationDelay: "200ms" }}
    />
    <span
      className="w-2 h-2 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 animate-pulse"
      style={{ animationDelay: "400ms" }}
    />
  </span>
);
export default DotLoader;

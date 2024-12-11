import React from "react";

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="flex items-center space-x-4">{/* Other content */}</div>
      <div className="text-xl ml-auto">Usernameee</div>{" "}
      {/* Placeholder for username */}
    </div>
  );
};

export default Header;

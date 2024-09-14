import React, { useState } from "react";

const DropDown = ({
  openFile,
  options,
}: {
  openFile: () => {};
  options: { id: number; name: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="dropdown-menu">
      <button onClick={toggleDropdown} className="dropdown-trigger">
        File
      </button>
      <div className={`options ${isOpen ? "show" : ""}`}>
        <ul>
          {options.map((option) => (
            <li key={option.id} onClick={openFile}>
              {option.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;

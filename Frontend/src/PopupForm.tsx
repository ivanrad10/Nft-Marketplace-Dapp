import React, { useState } from "react";

interface PopupFormProps {
  onClose: () => void;
}

const PopupForm: React.FC<PopupFormProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Minting NFT with the following details:");
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Image URL:", imgUrl);
    // Add your minting logic here
    onClose();
  };

  return (
    <div>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="url"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Mint</button>
      </form>
    </div>
  );
};

export default PopupForm;

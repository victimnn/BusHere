import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search/${searchTerm}`);
      setSearchTerm(""); //
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  } 

  return (
    <form onSubmit={handleSearch} className="search-form d-flex position-relative">
      <div className="input-group search-input-group shadow-sm">
        <input
          type="text"
          className="form-control search-input border-0"
          placeholder="O que você está procurando?"
          aria-label="Search"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className="btn search-button d-flex align-items-center justify-content-center" type="submit">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
        </button>
      </div>
    </form>
  )
}

export default SearchBar
"use client";
import { scrapeAndStoreProduct } from "@/lib/actions/page";
import React, { useState } from "react";
import { toast } from "react-toastify";

function SearchBar() {
  const [searchlink, setSearchlink] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidLink = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.in") ||
        hostname.includes("amazon.")
      ) {
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchlink(e.target.value);
  };

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = isValidLink(searchlink);

    if (!isValid) {
      toast.error("Please provide a valid Amazon product link.");
      return;
    }

    try {
      setLoading(true);
      await scrapeAndStoreProduct(searchlink);
      toast.success("Item fetched successfully!");
      setSearchlink('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader"></div>
        </div>
      )}
      <form className="flex flex-wrap gap-4 mt-12" onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Enter Amazon product link"
          className="searchbar-input"
          value={searchlink}
          onChange={handlechange}
        />
        <button
          type="submit"
          className="searchbar-btn"
          disabled={searchlink === "" || loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
    </>
  );
}

export default SearchBar;

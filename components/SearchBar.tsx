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
      const hostname = parsedUrl.hostname; //url complete or usme host ka name

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
  };

  const handlechange = (e: any) => {
    const value = e.target.value;

    setSearchlink(value);
  };

  const handlesubmit = async (e: any) => {
    e.preventDefault();
    const isValid = isValidLink(searchlink);

    if (!isValid)
      return alert("Please Provide a valid link of Amazon Product Amazon");

    try {
      setLoading(true);
 
      //scrape the prouct

       await scrapeAndStoreProduct(searchlink);
       toast.success("item fetch succesfully");
    } catch (err:any) {
      console.log(err);
      toast.error(err.message)
    } finally {
      setLoading(false);
    }

    // console.log("search link is : ", searchlink);
  };

  return (
    <>
    {loading && <div className='flex justify-center relative lg:-top-[470px] lg:ml-[400px] max-md:-top-[350px] sm:-top-[370px] max-sm:-top-[420px] z-999'>
  <div className="loader"></div>
</div> }
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handlesubmit}>
      <input
        type="text"
        placeholder="search product link"
        className="searchbar-input ch"
        value={searchlink}
        onChange={handlechange}
      />


      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchlink === ""}
      >
        {loading ? "Searching" : "Search"}
      </button>
    </form>




</>
  );
}

export default SearchBar;

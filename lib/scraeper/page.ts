

// "use server";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import {
//   extraDescription,
//   extractCurrency,
//   extractPrice,
//   extractReviews,
// } from "../utils";
// import { headers } from "next/headers";

// const USER_AGENTS = [
//  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', 
// 	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
// 	'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15', 
//   // Add more user agents as needed
// ];

// // Function to scrape Amazon product data
// export async function scrapeAmazonProduct(url: string) {
//   if (!url) return;

//   // BrightData proxy configuration
//   const username = String(process.env.SMTP_USER);
//   const password = String(process.env.SMTP_PASS);
//   const port = 22225;
//   const session_id = (1000000 * Math.random()) | 0;

//   const options = {
//     auth: {
//       username: `${username}-session-${session_id}`,
//       password,
//     },
//     host: "brd.superproxy.io",
//     port,
//     rejectUnauthorized: false,
   

//   };

//   const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

//   const fetchPage:any = async (retryCount = 3) => {
//     try {
//       console.log("Fetching URL:", url);

//       const response = await axios.get(url, {
//         timeout: 5000,
//         ...options,
       
         
//           headers:{
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
//             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//             "Accept-Language": "en-US,en;q=0.5",
//             "Accept-Encoding": "gzip, deflate",
//             "Connection": "keep-alive",
//             "Upgrade-Insecure-Requests": "1",
//             "Sec-Fetch-Dest": "document",
//             "Sec-Fetch-Mode": "navigate",
//             "Sec-Fetch-Site": "none",
//             "Sec-Fetch-User": "?1",
//             "Cache-Control": "max-age=0",
      
//         },

      
//       });
//       console.log("Page fetched successfully");

//       return response.data;
//     } catch (error: any) {
//       console.error(
//         "Error occurred while scraping:",
//         error.response ? error.response.data : error.message
//       );
//       if (error.response && error.response.status === 503 && retryCount > 0) {
//         console.log(`Retrying... (${3 - retryCount + 1})`);
//         await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
//         return fetchPage(retryCount - 1);
//       }
//       throw error; // Re-throw the error to handle it further up the call stack
//     }
//   };

//   try {
//     const pageData = await fetchPage();
//     const $ = cheerio.load(pageData);

//     const title = $("#productTitle").text().trim();
//     const currentPrice = extractPrice(
//       $(".priceToPay span.a-price-whole"),
//       $("a.size.base.a-color-price"),
//       $(".a-button-selected .a-color-base")
//     );
//     const originalPrice = extractPrice(
//       $("#priceblock_ourprice"),
//       $("span.a-price.a-text-price span.a-offscreen"),
//       $("#listPrice"),
//       $("#priceblock_dealprice"),
//       $("a.size.base.a-color-price")
//     );
//     const outOfStock =
//       $("#availability span").text().trim().toLowerCase() ===
//       "currently unavailable";
//     const images =
//       $("#imgBlkFront").attr("data-a-dynamic-image") ||
//       $("#landingImage").attr("data-a-dynamic-image") ||
//       "{}";
//     const imageUrls =await Object.keys(JSON.parse(images));
//     const currency =await extractCurrency($(".a-price-symbol"));
//     const discountRate =await $(".savingsPercentage").text().replace(/[-%]/g, "");
//     const description =await extraDescription($);
//     const reviews = await extractReviews(url);

//     const data = {
//       url,
//       currency: currency || "$",
//       image: imageUrls[0],
//       title: title,
//       currentPrice: Number(currentPrice) || Number(originalPrice),
//       originalPrice: Number(originalPrice) || Number(currentPrice),
//       priceHistory: [],
//       discountRate: Number(discountRate),
//       category: "category", // Replace with actual category
//       reviewsCount: 100, // Replace with actual count
//       stars: 4.5, // Replace with actual stars
//       isOutOfStock: outOfStock,
//       description,
//       lowestPrice: Number(currentPrice) || Number(originalPrice),
//       highestPrice: Number(originalPrice) || Number(currentPrice),
//       averagePrice: Number(currentPrice) || Number(originalPrice),
//       reviews: reviews.map((review: any) => ({
//         id: review.id,
//         title: review.title.replace(/\d+/g, "").trim(),
//         rating: review.rating,
//         date: review.date,
//         body: review.body.replace(/\s+Read more$/, "").trim(),
//         reviewer: review.reviewer,
//       })),
//     };

//     return data;
//   } catch (error: any) {
//     console.error(
//       "Error occurred while scraping:",
//       error.response ? error.response.data : error.message
//     );
//     if (error.response) {
//       console.error("Status:", error.response.status);
//       console.error("Headers:", error.response.headers);
//       console.error("Data:", error.response.data);
//     }
//     throw error; // Re-throw the error to handle it further up the call stack
//   }
// }



"use server";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  extraDescription,
  extractCurrency,
  extractPrice,
  extractReviews,
} from "../utils";

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', 
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15', 
  // Add more user agents as needed
];

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Function to scrape Amazon product data
export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  const fetchPage = async (retryCount = 3) => {
    const username = process.env.SMTP_USER || '';
    const password = process.env.SMTP_PASS || '';

    if (!username || !password) {
      throw new Error('SMTP_USER or SMTP_PASS is not set');
    }

    const session_id = (1000000 * Math.random()) | 0;

    const proxy = {
      host: "brd.superproxy.io",
      port: 22225,
      auth: {
        username: `${username}-session-${session_id}`,
        password: password,
      },
    };

    try {
      console.log("Fetching URL:", url);

      const response = await axios.get(url, {
        timeout: 25000,
        proxy: proxy,
        headers: {
          'User-Agent': getRandomUserAgent(),
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Cache-Control": "max-age=0",
        },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      });

      console.log("Page fetched successfully");
      return response.data;
    } catch (error: any) {
      console.error(
        "Error occurred while scraping:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 503 && retryCount > 0) {
        console.log(`Retrying... (${3 - retryCount + 1})`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        return fetchPage(retryCount - 1);
      }
      throw error; // Re-throw the error to handle it further up the call stack
    }
  };

  try {
    const pageData = await fetchPage();
    const $ = cheerio.load(pageData);

    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $("span.a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $("a.size.base.a-color-price")
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const description = extraDescription($);
    const reviews = await extractReviews(url);

    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title: title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category", // Replace with actual category
      reviewsCount: 100, // Replace with actual count
      stars: 4.5, // Replace with actual stars
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
      reviews: reviews.map((review: any) => ({
        id: review.id,
        title: review.title.replace(/\d+/g, "").trim(),
        rating: review.rating,
        date: review.date,
        body: review.body.replace(/\s+Read more$/, "").trim(),
        reviewer: review.reviewer,
      })),
    };

    return data;
  } catch (error: any) {
    console.error(
      "Error occurred while scraping:",
      error.response ? error.response.data : error.message
    );
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    }
    throw error; // Re-throw the error to handle it further up the call stack
  }
}

// "use server"
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { extractCurrency, extraDescription, extractPrice, extractReviews } from '../utils';
// import productModel from '../models/productModel'; // Import your Mongoose model

// export async function scrapeAmazonProduct(url: string) {
//   if (!url) {
//     console.error('No URL provided');
//     return;
//   }
//   const userAgentList = [
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
//     "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
//     "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
//   ];
//   function getRandomUserAgent() {
//     return userAgentList[Math.floor(Math.random() * userAgentList.length)];
//   }

//   const axiosOptions = {
//     headers: {
//       'User-Agent': getRandomUserAgent(),
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//       'Connection': 'keep-alive',
//       'Upgrade-Insecure-Requests': '1',
//     },
//     timeout: 10000,
//   };

//   try {
//     // console.log('Fetching URL:', url);
//     const response = await axios.get(url, axiosOptions);
//     console.log('Page fetched successfully');

//     const $ = cheerio.load(response.data);

//     const title = $('#productTitle').text().trim();
//     const currentPrice = extractPrice($('.priceToPay span.a-price-whole'), $('a.size.base.a-color-price'), $('.a-button-selected .a-color-base'));
//     const originalPrice = extractPrice($('#priceblock_ourprice'), $('span.a-price.a-text-price span.a-offscreen'), $('#listPrice'), $('#priceblock_dealprice'), $('a.size.base.a-color-price'));
//     const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
//     const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';
//     const imageUrls = Object.keys(JSON.parse(images));
//     const currency = extractCurrency($('.a-price-symbol'));
//     const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
//     const description = extraDescription($);
//     const reviews = await extractReviews(url);

//     console.log(imageUrls)
//     console.log("title",title)
//     const data = {
//       url,
//       currency: currency || '$',
//       image: imageUrls[0],
//       title,
//       currentPrice: Number(currentPrice) || Number(originalPrice),
//       originalPrice: Number(originalPrice) || Number(currentPrice),
//       priceHistory: [],
//       discountRate: Number(discountRate),
//       category: 'category',
//       reviewsCount: 100,
//       stars: 4.5,
//       isOutOfStock: outOfStock,
//       description,
//       lowestPrice: Number(currentPrice) || Number(originalPrice),
//       highestPrice: Number(originalPrice) || Number(currentPrice),
//       averagePrice: Number(currentPrice) || Number(originalPrice),
//       reviews: reviews.map((review: any) => ({
//         id: review.id,
//         title: review.title.replace(/\d+/g, '').trim(),
//         rating: review.rating,
//         date: review.date,
//         body: review.body.replace(/\s+Read more$/, '').trim(),
//         reviewer: review.reviewer,
//       })),
//     };

//     console.log('Scraped image:', data.image);
//     console.log("scraped title",data.title)

//     // Save data to MongoDB
//     const product = new productModel(data);
//     await product.save();
//     console.log('Product saved successfully.');

//     return data;
//   } catch (error: any) {
//     console.error('Error occurred while scraping:', error.response ? error.response.data : error.message);
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Headers:', error.response.headers);
//       console.error('Data:', error.response.data);
//     }
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
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
  // Add more user agents as needed
];

// Function to scrape Amazon product data
export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.SMTP_USER);
  const password = String(process.env.SMTP_PASS);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  const fetchPage:any = async (retryCount = 3) => {
    try {
      console.log("Fetching URL:", url);

      const response = await axios.get(url, {
        timeout: 15000,
        ...options,
        headers: {
          'User-Agent': getRandomUserAgent(),
        },
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





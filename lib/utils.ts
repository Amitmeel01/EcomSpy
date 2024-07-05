import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { PriceHistoryItem, Product } from "@/types/page";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
};

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements: any[]): number | null {
  for (const element of elements) {
    const priceText = element.text().trim();
    if (priceText) {
      const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(price)) {
        return price;
      }
    }
  }
  return null;
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : '';
}

export function extraDescription($: any) {
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    '#productDescription > p',
    '#feature-bullets ul li',
    '.a-section.a-spacing-medium',
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }
  return "";
}

export async function extractReviews(initialUrl: string) {
  let reviews: any[] = [];
  let nextPageUrl: string | null = initialUrl;
  let attempts = 0;

  while (nextPageUrl && reviews.length < 15 && attempts < 5) {
    try {
      const response = await axios.get(nextPageUrl, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      });

      const $ = cheerio.load(response.data);

      $('.a-section.review.aok-relative').each((index, element) => {
        if (reviews.length < 15) {
          const ratingText = $(element).find('.review-rating').text().trim();
          const ratingMatch = ratingText.match(/\d+(\.\d+)?/);
          const rating = ratingMatch ? parseFloat(ratingMatch[0]) : null;

          const review: any = {
              id: $(element).attr('id'),
              title: $(element).find('.review-title').text().trim().replace(/\d+/g, ''),
              rating: rating,
              date: $(element).find('.review-date').text().trim(),
              body: $(element).find('.review-body').text().trim(),
              reviewer: $(element).find('.reviewer').text().trim(),
          };
          reviews.push(review);
        }
      });

      nextPageUrl = getNextPageUrl($);
      attempts++;
    } catch (error:any) {
      console.error("Failed to fetch reviews page:", error.message);
      attempts++;
    }
  }

  return reviews;
}

function getNextPageUrl($: any) {
  const nextPageLink = $('li.a-last a').attr('href');
  if (nextPageLink) {
    return `https://www.amazon.in${nextPageLink}`;
  }
  return null;
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }
  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }
  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;
  return averagePrice;
}

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

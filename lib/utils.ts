
import { PriceHistoryItem, Product } from "@/types/page";
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
};

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements:any) {
    for (const element of elements) {
        const priceText = element.text().trim();
        if (priceText) {
            // Extract only the numeric part including commas and dots
            const match = priceText.match(/[\d,]+(\.\d{1,2})?/);
            if (match) {
                // Remove commas for numeric conversion
                return match[0].replace(/,/g, '');
            }
        }
    }
    return '';
}

export function extractCurrency(element: any) {
    const currencyText = element.text().trim().slice(0, 1);
    return currencyText ? currencyText : ''; // Return the first character (currency symbol)
}

export function extraDescription($: any) {
    const selectors = [
        ".a-unordered-list .a-list-item",
        ".a-expander-content p",
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

    return ""; // Return an empty string if no matching elements were found
}



export async function extractReviews(initialUrl: string) {
    let reviews: any[] = [];
    let nextPageUrl: string | null = initialUrl;

    while (nextPageUrl && reviews.length < 30) {
        const response = await axios.get(nextPageUrl, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
            proxy: false,
        });

        const $ = cheerio.load(response.data);

        $('.a-section.review.aok-relative').each((index, element) => {
            if (reviews.length < 30) {
                const ratingText = $(element).find('[data-hook="review-star-rating"]').text().trim();
                const ratingMatch = ratingText.match(/\d+(\.\d+)?/);
                const rating = ratingMatch ? parseFloat(ratingMatch[0]) : null;

                const review: any = {
                    id: $(element).attr('id'),
                    title: $(element).find('[data-hook="review-title"]').text().trim().replace(/\d+/g, ''),
                    rating: rating,
                    date: $(element).find('[data-hook="review-date"]').text().trim(),
                    body: $(element).find('[data-hook="review-body"]').text().trim().replace(/\s+Read more$/, ''),
                    reviewer: $(element).find('[data-hook="genome-widget"]').text().trim(),
                };
                reviews.push(review);
            }
        });

        // nextPageUrl = getNextPageUrl($);
    }

    return reviews;
}

export function getNextPageUrl($: any) {
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

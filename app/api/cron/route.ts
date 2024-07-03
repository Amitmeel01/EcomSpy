import { NextResponse } from "next/server";
import connectDb from "@/lib/databse/mongoose";
import Product from "@/lib/models/productModel";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import productModel from "@/lib/models/productModel";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import axios from "axios";

export const maxDuration = 60; // Adjusted to 60 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await connectDb();

    const products = await productModel.find({});

    if (!products) throw new Error("No products fetched");

    const BATCH_SIZE = 10; // Number of products to process per request
    const { searchParams } = new URL(request.url);
    const batchIndex = parseInt(searchParams.get("batch") || "0", 10);

    const productsBatch = products.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE);

    const updatedProducts = await Promise.all(
      productsBatch.map(async (currentProduct) => {
        const current = await axios.get(`http://localhost:3000/api/scraper?url=${currentProduct.url}`);
        const scrapedProduct = current.data;

        if (!scrapedProduct) return null;

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
          },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product,
          { new: true }
        );

        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          const userEmails = updatedProduct.users.map((user: any) => user.email);
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    const nextBatchIndex = batchIndex + 1;
    const hasMore = products.length > nextBatchIndex * BATCH_SIZE;

    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
      nextBatch: hasMore ? `/api/cron?batch=${nextBatchIndex}` : null,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}

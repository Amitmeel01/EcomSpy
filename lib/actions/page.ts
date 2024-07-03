"use server"

import { revalidatePath } from "next/cache";


import { scrapeAmazonProduct } from "../scraeper/page";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types/page";
import { generateEmailBody, sendEmail } from "../nodemailer";
import productModel from "../models/productModel";
import connectDb from "../databse/mongoose";



const loadDb = async () => {
 
    await connectDb();
   
};


loadDb();



export async function scrapeAndStoreProduct(productUrl: string) {
  if(!productUrl) return;

  try {
    await loadDb()

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if(!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await productModel.findOne({ url: scrapedProduct.url });

    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await productModel.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    // revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    await loadDb()

    const product = await productModel.findOne({ _id: productId });

    if(!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    await loadDb()

    const products = await productModel.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    await loadDb()

    const currentProduct = await productModel.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await productModel.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  await loadDb();
  try {
    const product = await productModel.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
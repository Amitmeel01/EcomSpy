// models/productModel.js
import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: String, required: true },
  body: { type: String, required: true },
  reviewer: { type: String, required: true },
});


const productSchema = new Schema({
  url: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  orignalPrice: { type: Number, required: true },
  priceHistory: [
    { 
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    },
  ],
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  averagePrice: { type: Number },
  discountRate: { type: Number },
  description: { type: String },
  category: { type: String },
  reviewsCount: { type: Number },
  isOutOfStock: { type: Boolean, default: false },
  users: [
    { email: { type: String, required: true } }
  ],

  reviews: [reviewSchema],
}, { timestamps: true });

const productModel =mongoose.models.productModel || mongoose.model('productModel', productSchema);

export default productModel;

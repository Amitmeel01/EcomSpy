import React from 'react';
import Image from 'next/image';



function ReviewCard({ product }:any) {
  // console.log("Review",product.image)
  const defaultReviewerImage = '/assets/images/user_img.png'; // A default image for when reviewer is undefined
  
  const imageUrl = product.reviewer.match(/src="([^"]+)"/)[1];

  return (
    <div className="review-card p-4 border rounded-lg shadow-md mt-16">
      <div className="review-card_img-container flex items-center mb-4">
        <Image
          src={imageUrl}  // Fallback to default image
          alt="Reviewer"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="ml-3">
          <h3 className="text-lg font-semibold">{product.title.split("stars")[1]}</h3>
          <p className="text-sm text-gray-500">{product.date}</p>
        </div>
      </div>

      <div className="review-card_body">
        <p className="text-sm text-gray-700">{product.body}</p>
      </div>

      <div className="review-card_footer flex justify-between items-center mt-4">
        <div className="review-card_rating flex items-center">
          <span className="text-yellow-500">⭐</span>
          <span className="ml-1">{product.rating} out of 5</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;

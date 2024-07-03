"use client";

import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';

const heroImage = [
  { imageUrl: '/assets/images/hero1.jpg', alt: 'laptop' },
  { imageUrl: '/assets/images/hero2.jpg', alt: 'earbuds' },
  { imageUrl: '/assets/images/hero3.jpg', alt: 'watch' },
  { imageUrl: '/assets/images/hero4.jpg', alt: 'apple-watch' },
  { imageUrl: '/assets/images/hero5.jpg', alt: 'headphone' },
  { imageUrl: '/assets/images/hero6.jpg', alt: 'bag' },
  { imageUrl: '/assets/images/hero7.jpg', alt: 'laptop' }
];

function Hero() {
  return (
    <div className='hero-carousel'>
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImage.map((product) => (
          <div key={product.alt}>
            <Image
              src={product.imageUrl}
              alt={product.alt}
              width={400}
              height={400}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Hero;

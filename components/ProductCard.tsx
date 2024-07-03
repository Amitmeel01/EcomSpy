import { Product } from '@/types/page';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
    product: Product;
}

function ProductCard({ product }: Props) {
    // Log the image URL for debugging

    // console.log("id",product._id)
    // Add a default image if product.image is not valid
    const imageUrl = product.image && product.image.startsWith('http') ? product.image : `/${product.image}`;

    return (
        <Link href={`/product/${product._id}`} className='product-card mb-20'>
            <div className='product-card_img-container '>
                <Image
                    src={imageUrl}
                    alt={product.title}
                    width={200}
                    height={200}
                    className='product-card-img'
                />
            </div>

            <div className='flex flex-col gap-3'>
                <h3 className='product-title'>{product.title}</h3>

                <div className='flex justify-between'>
                    <p className='text-black opacity-50 text-lg capitalize'>
                        {product.category}
                    </p>

                    <p className='text-black text-lg font-semibold'>
                        <span>{product?.currency}</span>
                        <span>{product?.currentPrice}</span>
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;

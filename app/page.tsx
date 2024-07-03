
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import { getAllProducts } from '@/lib/actions/page'
import Image from 'next/image'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const Home=async ()=>{

    const allProducts=await getAllProducts();
  

  return (
    <>
    <ToastContainer/>
     <section className='px-6 md:px-20 py-24 '>
      <div className='flex max-xl:flex-col gap-16'>
<div className='flex flex-col justify-center'>
  <p className='small-text'>
    Best Deals Start Here:
    <Image
    src='/assets/icons/arrow-right.svg'
    alt='arrow-right'
    width={20}
    height={20}
    />


  </p>

  <h1 className='head-text'>
    Unleash the Power of  
    <hr className='opacity-0'/>
     <span className='text-red-500'>EcomSpy</span>
  </h1>

  <p className='mt-6'>
Powerful , self-serve product and growth analytics to help you convert,engage , and retain more.

  </p>
  <SearchBar/>

</div>

   <div>
   <Hero/>
   </div>
       

      </div>
     </section>


  <section className='tranding-section'>
    <h2 className='section-text'>Trending</h2>

    <div className='flex flex-wrap gap-x-8 gap-y-16'>
      
{allProducts?.map((product)=>(
     <ProductCard key={product._id} product={product}/>
))}


    </div>

  </section>

    </>
  )
}

export default Home
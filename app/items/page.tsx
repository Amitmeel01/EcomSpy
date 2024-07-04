import Image from 'next/image'
import React from 'react'

function page() {
  return (
    <div className='bg-green-300 h-screen py-8 px-8 w-auto'>

        <div>
               <div className='border-2 flex items-center justify-center'>
                <Image
                 src='/assets/images/hero1.jpg'
                 alt='hero1'
                 width={400}
                 height={400}
                />
                <h1>TV</h1>
                
                </div> 
        </div>
    </div>
  )
}

export default page
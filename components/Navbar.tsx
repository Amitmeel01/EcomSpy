"use client";
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import ItemSearch from './ItemSearch';
import { useState } from 'react';
import itemSearch from './ItemSearch';



const navIcons=[
    // {src:'/assets/icons/search.svg',alt:'search'},
    {src:'/assets/icons/user.svg',alt:'user'},
    {src:'/assets/icons/black-heart.svg',alt:'black-heart'}
]

function Navbar() {

    const [isItemSearchOpen, setIsItemSearchOpen] = useState(false);

  const handleIconClick = (alt:any) => {

    if (alt === 'search') {
      setIsItemSearchOpen(!isItemSearchOpen);
    //   itemSearch();
      
    }
    // Handle other icon clicks if needed
  };

  return (
    <div>
        <header className='w-full'>
            <nav className='nav'>
                <Link href='/' className='flex items-center gap-1'>
                <Image
                
                src='/assets/icons/logo.svg'
                width={27}
                height={27}
                alt='logo'
                />

                     <p className='nav-logo'>
                     EcomSpy

                     </p>

                </Link>

                            <ItemSearch/>

                <div className='flex items-center gap-5'>
                    {
                        navIcons.map((item)=>(
                            
                         <Image
                         className='cursor-pointer'
                         onClick={()=>handleIconClick(item.alt)}
                         key={item.alt}
                         src={item.src}
                         width={28}
                         height={28}
                         alt={item.alt}
                         
                         
                         />
                        
                        ))
                    }

                </div>
                
            </nav>
        </header>
    </div>
  )
}

export default Navbar
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'



const navIcons=[
    {src:'/assets/icons/search.svg',alt:'search'},
    {src:'/assets/icons/user.svg',alt:'user'},
    {src:'/assets/icons/black-heart.svg',alt:'black-heart'}
]

function Navbar() {
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

                <div className='flex items-center gap-5'>
                    {
                        navIcons.map((item)=>(
                         <Image
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
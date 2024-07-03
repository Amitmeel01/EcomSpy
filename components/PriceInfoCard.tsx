import Image from 'next/image'
import React from 'react'
import { ToastContainer } from 'react-toastify'

interface Props{
    title:string,
    iconSrc:string,
    borderColor:string,
    value:string
    
}

function PriceInfoCard({title,iconSrc,value,borderColor}:Props) {

  return (
    <>
<ToastContainer/>

    <div className={`price-info_card border-1-[${borderColor }]`}>
             
             <p className='text-base text-black-100'>{title}</p>

             <div className='flex gap-1'>
            
            <Image src={iconSrc} alt={title} width={24} height={24}/>

            <p className='text-2xl font-bold text-secondary'>{value}</p>

             </div>


    </div>

    </>
  )
}

export default PriceInfoCard
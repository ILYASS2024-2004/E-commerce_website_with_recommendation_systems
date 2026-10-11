import React from 'react'
import HeroSection from '../components/home/HeroSection'
import DropNow from '../components/home/DropNow'
import BestSellers from '../components/home/BestSellers'
//import HorizontalScroll from '../components/home/3d/HorizontalScroll'
import Footer from '../components/Footer'
import HorizontalScrollo from '../components/home/3d/HorizontalScrollo'
import TransicBack from '../components/home/TransicBack'
import Category from '../components/home/Category'
import Partners from '../components/home/Partners'


const HomePage = () => {
  return (
    <div>
      <HeroSection />
       <div className='bg-[#f8f8f8] relative flex justify-center items-center  h-[30vh]'>
    <img src="/img/sep.png" className='  h-[100px] select-none pointer-events-none ' alt="abt" />




      </div>
      <Partners ></Partners>

      <Category></Category>
       <div className='bg-[#f8f8f8] relative flex justify-center items-center  h-[30vh]'>
    <img src="/img/sep.png" className=' mix-blend-difference  h-[100px] select-none pointer-events-none ' alt="abt" />




      </div>
      <DropNow></DropNow>
      <BestSellers></BestSellers>
   
        <div className='bg-[#f8f8f8] relative flex justify-center items-center  h-[30vh] mb-12'>
    <img src="/img/sep.png" className=' mix-blend-luminosity  h-[100px] select-none pointer-events-none ' alt="abt" />




      </div>
    
      <Footer />
      
  
    </div>
    
  )
    
}

export default HomePage
import React,{useState,useEffect} from 'react';
import logo from "../../assets/logo.svg"
import bgImgLg from "../../assets/main_banner_bg.png";
import bgImgSm from "../../assets/main_banner_bg_sm.png";
import img1 from "../../assets/bottom_banner_image.png"
import img2 from "../../assets/bottom_banner_image_sm.png"
import { features , categories, footer } from '../../assets/asset';


import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { IndianRupee,ArrowRight } from "lucide-react";

import { useQuery } from '@tanstack/react-query';
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { calculateDiscount } from '../../utils/CalculateDiscount';




function Home() {
  
  const [error, setError] = useState("");

  const navigate=useNavigate();
  
    const fetchProducts = async () => {
      const response = await axios.get(`${serverUrlAPI}product/topFive`);
      console.log(response.data)
      return response.data;
    };
  
    const { data: products = [], isLoading, isError } = useQuery({
      queryKey: ['products'],
      queryFn: fetchProducts,
      onError: (err) => setError(getErrorMessage(err)),
    });

    
  return (
    <>
      <div className='px-6 md:px16 lg:px-24 xl:px-32 mt-[60px]'>
            
            <div className='relative'>   
                <img src={bgImgLg} className='w-full hidden md:block'></img>
                <img src={bgImgSm} className='w-full md:hidden'></img>
                <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end
                md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>

                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left
                max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 text-gray-700'
                >Freshness You Can Trust, Savings You will Love!</h1>
                
            
            <div className='flex items-center mt-6 font-medium'>
                <Link 
                to="/all"
                className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-[#4FBF8B] 
                hover:bg-[#4FBF8B]-dull transition rounded text-white cursor-pointer'>Shop now 
                <ArrowRight className='md:hidden transition group-focus:translate-x-1'/>
                </Link>
                
                <Link
                to="/all"
                className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer text-gray-700'>Explore deals 
                <ArrowRight className=' transition group-hover:translate-x-1'/>
                </Link>
            </div>

            </div>
            </div>



            {/* category */}
            <div className='mt-16'>
                <div >
                    <h1 className='text-gray-700 text-2xl md:text-3xl font-semibold'>Categories</h1>    
                </div>
                <div className='flex flex-wrap gap-18 mx-12 mt-8 justify-start'>
                {categories.map((item, index) => (
                  <div
                    key={index}
                    className='flex flex-col justify-center items-center w-40 h-40 md:w-[200px] md:h-[200px] rounded-xl shadow-md p-3 text-center cursor-pointer'
                    style={{
                      background: item.bgColor, 
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={()=>navigate(`/categoryProduct?category=${item.category}`)}
                  >
                    <img src={item.image} className='md:w-[100px] h-[100px] hover:scale-105 transition duration-200 ' alt={item.text} />
                    <h3 className="mt-2 text-sm md:text-base text-gray-700">{item.text}</h3>
                  </div>
                ))}

                </div>

            </div>


            {/* Best seller */}
            <div className='mt-16'>
           
                        <div >
                            <h1 className='text-gray-700 text-3xl font-semibold'>Best Sellers</h1>
                            
                        </div>

                        {isLoading && <p className="text-[#4FBF8B] mt-4">Loading products...</p>}
                        {isError && <p className="text-red-500 mt-4">{error}</p>}

                        <div className="flex flex-wrap gap-18 mt-8 justify-start">
                            {products && products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.itemId} product={product} />
                            ))
                            ) : (
                            <p>No products available</p>
                            )}
                        </div>

                        </div>



        
            {/* bottom banner */}
            <div className='relative mt-24'>
                 <img src={img1} className='w-full hidden md:block'></img>
                 <img src={img2} className='md:hidden w-full'></img>

                 <div className='absolute inset-0 flex flex-col items-center md:items-end
                 md:justify-center pt-16 md:pt-0 md:pr-24'>
                  <div>
                    <h1 className='text-2xl md:text-3xl font-semibold text-[#4FBF8B] 
                    mb-6'>Why We Are the Best?</h1>
                    {features.map((item,index)=>(

                      <div key={index} className='flex items-center gap-4 mt-2'>
                        <img src={item.icon} className='md:w-11 w-9'></img>
                        <div>
                        <h3 className='text-lg md:text-xl font-semibold'>{item.title}</h3>
                        <p className='text-gray-500/70 text-xs md:text-sm'>{item.description}</p>
                        </div>


                      </div>

                    ))}
                  </div>

                 </div>
            
            
             </div>        

      </div>



      {/* footer */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-20 bg-[#4FBF8B]/10">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                        <div>
                            <img className="w-34 md:w-32" src={logo}  />
                            <p className="max-w-[410px] mt-6">We offer a wide range of fresh vegetables, fruits, seeds, and plants, making healthy living simple and affordable.</p>
                        </div>
                        <div className="flex flex-wrap md:justify-evenly  w-full md:w-[45%] gap-5">
                            {footer.map((section, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                                    <ul className="text-sm space-y-1">
                                        {section.links.map((link, i) => (
                                            <li key={i}>
                                                <a href="#" className="hover:underline transition">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                   <p class="py-4 text-center text-xs md:text-sm text-gray-500">
                      Copyright 2025 © Green Cart. All Right Reserved.
                  </p>
       </div>
    </>
  );
}


    function ProductCard({ product }) {
    const { name, category, img, price, discount, description, itemId,rating } = product;
    const navigate = useNavigate();
  
    const handleMenuItemCLick = (id) => {
      navigate(`/product/item?id=${id}`);
    };
  
    return (
      <div className="border border-gray-300 rounded-md px-4 py-3 bg-white w-[220px] flex-shrink-0"
      onClick={() => handleMenuItemCLick(itemId)}
      >
  
        <div className="group cursor-pointer flex items-center justify-center px-2 h-40 overflow-hidden">
          <img
            className="group-hover:scale-105 transition duration-300 max-h-full object-contain"
            src={img}
            alt={name}
          />
        </div>
  
        <div className="text-gray-500 text-sm mt-2">
          <p>{description}</p>
          <p className="text-gray-700 font-medium text-lg truncate">{name}</p>
  
          <div className="flex items-center gap-0.5">
            {Array(5).fill('').map((_, i) => (
                                product.rating > i ? (
                                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#4FBF8B" />
                                    </svg>
                                ) : (
                                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#4FBF8B" fillOpacity="0.35"
 />
                                    </svg>
                                )
                            ))}
                            <p>({product.rating})</p>
                        </div>                             
  
          <div className="flex items-end justify-between mt-3">
            <p className="text-[#4FBF8B] font-semibold  text-2xl flex justify-center items-center">
            <IndianRupee className="h-5 w-5" />{" "}
              {discount > 0 ? (
                <>
                  <strike>{price}</strike>{" "}
                  <span className="ms-2">{calculateDiscount(price, discount)}</span>{" "}
                </>
              ) : (
                <span>{price}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  
  

export default Home;

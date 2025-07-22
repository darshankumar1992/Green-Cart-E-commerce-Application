import React, { useEffect, useState } from "react";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import { calculateDiscount } from '../../utils/CalculateDiscount';
import { IndianRupee } from "lucide-react";

function ProductItem() {
    const [searchParam] = useSearchParams();
    const [isSaved, setSaved] = useState(false);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

   

    const productDataFetch = async ()=> {
        const productId = searchParam.get("id");
        if(productId === null){
            return;
        }

        const response = await axiosInstance.get(`${serverUrlAPI}product/${productId}`);
        return response.data;
    }

    const { data: productData } = useQuery({
        queryKey: ["product_item", searchParam.get("id")],
        queryFn: productDataFetch,
      });

      const {ProductItem} = productData || {};
      const {img, name, description, discount, price, category, rating,about} = ProductItem || {};
      
      const categori = productData?.ProductItem?.category;
      
      const fetchProducts = async () => {
        const response = await axiosInstance.get(`${serverUrlAPI}product/category?category=${categori}`);
        return response.data;
      };
      
      const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ['products', categori],
        queryFn: fetchProducts,
        enabled: !!category,  
      });
      
      const handleBuyClick = ()=>{
        const user = queryClient.getQueryData(["profile"]);
        console.log(user);
        if (!user || user === "null" ) {
          toast.error("Please login to continue");

          setTimeout(() => {
            navigate("/login");
          }, 1000);
          
          return;
        }
        else{
          const data = [{
            quantity : 1,
            productItem: ProductItem
          }]
  
          navigate("/checkout",{
            state : {
              source : "none",
              checkoutDetails: data
            }
          })
  
        }
        
      }





      const addToCart = async (val) => {
        
        const response = await axiosInstance.post(`${serverUrlAPI}cart/add`,val);
        return response.data;
      }

      const cartAddMutate = useMutation({
        mutationKey: ["cart-add", searchParam.get("id")],
        mutationFn: addToCart,
        onSuccess: (data)=>{
          console.log(data);
          toast.success("Item Added To  Cart");
          setSaved(true);
        },
        onError: (err) => {
          const {status} =err?.response || {};
          if(status === 401)
          {
            toast.error("Already exists in cart!");
            return;
          }
          toast.error(getErrorMessage(err));
        },

      });
  
      const handleAddToCartBtnClick = ()=> {
        const user = queryClient.getQueryData(["profile"]);
          if (!user || user === "null") {
            toast.error("Please login to add to cart");
            navigate("/login");
            return;
          }
        const data = {
        
          userId: user.id,
          itemId: parseInt(searchParam.get("id")),
        };
        cartAddMutate.mutate(data);
      };

    

  return (
    <>
     <div className='px-6 md:px16 lg:px-24 xl:px-32 mt-[60px]'>
        <div className="max-w-8xl w-full md:px-20 ">
            <p className="text-gray-700 font-medium">
                <Link to="/">Home / </Link> 
                <Link to="/all">Products / </Link> 
                <Link to={`/categoryProduct?category=${category}`}>{category} / </Link> 
                <span className="text-[#4FBF8B]">{name}</span>
            </p>
          

          <div className="flex flex-col md:flex-row gap-16 mt-4">
              
                  
                  <div className="border border-gray-500/30 max-w-[400px] md:h-[450px] rounded overflow-hidden flex justify-center items-center">
                      <img src={img} alt="Selected product" />
                  </div>
              

              <div className="text-sm w-full md:w-1/2">
                  <h1 className="text-3xl font-medium text-gray-700">{name}</h1>

                  <div className="flex items-center gap-0.5 mt-1">
                      {Array(5).fill('').map((_, i) => (
                          rating > i ? (
                              <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#4FBF8B" />
                              </svg>
                          ) : (
                              <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#4FBF8B" fillOpacity="0.35" />
                              </svg>
                          )
                      ))}
                      <p className="text-base ml-2">({rating})</p>
                  </div>

                  <div className="mt-4 text-gray-700">
                      {discount>0 && <p className="text-gray-500/70 line-through flex">₹{` `}{price}</p>}
                      <p className="text-2xl font-medium flex">₹{` `}{calculateDiscount(price,discount)}</p>
                      <span className="text-gray-500">(inclusive of all taxes)</span>
                  </div>

                  <p className="text-base font-medium mt-6 text-gray-700">About Product</p>
                  <ul className="list-disc ml-4 text-gray-500">
                    {about && about.split(",").map((desc, index) => (
                        <li key={index} className="capitalize">{desc.trim()}</li>
                    ))}
                  </ul>

                  <div className="flex items-center mt-10 gap-4 text-base">
                     {isSaved?
                     <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                          Saved To Cart
                      </button>
                      :
                      <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" 
                      onClick={handleAddToCartBtnClick}>
                          Add to Cart
                      </button>}
                      
                      <button className="w-full py-3.5 cursor-pointer font-medium bg-[#4FBF8B] text-white hover:bg-emerald-600   transition" onClick={handleBuyClick}>
                          Buy now
                      </button>
                  </div>
              </div>
          </div>
      </div>
        <div>
            <div className="flex flex-col justify-center items-center mt-12 gap-1">
                <h1 className="md:text-3xl text-2xl text-gray-700 font-semibold">Related Products</h1>
                <div className="w-[70px] h-0.5 bg-[#4FBF8B] rounded-full"></div>  
            </div>
            <div className="flex flex-wrap gap-18 mt-8 md:justify-start justify-center">
                            {products && products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.itemId} product={product} />
                            ))
                            ) : (
                            <p>No products available</p>
                            )}
            </div>
            

        </div>
      </div>
    </>
  )
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
                                        <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#4FBF8B" fillOpacity="0.35" />
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

export default ProductItem
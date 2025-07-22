import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { IndianRupee } from "lucide-react";
import { calculateDiscount } from "../../utils/CalculateDiscount";

function Allproduct() {
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    const response = await axios.get(`${serverUrlAPI}product/all`);
    return response.data;
  };

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    onError: (err) => setError(getErrorMessage(err)),
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-[60px]'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between items-center'>
        <div className='flex flex-col items-end'>
          <h1 className='text-gray-700 text-2xl font-medium'>ALL PRODUCTS</h1>
          <div className='w-16 h-0.5 bg-[#4FBF8B] rounded-full'></div>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 md:mt-0 px-4 py-2 border w-[200px] md:w-[300px] md:mr-[50px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4FBF8B]"
        />
      </div>

      {isLoading && <p className="text-[#4FBF8B] mt-4">Loading products...</p>}
      {isError && <p className="text-red-500 mt-4">{error}</p>}

      <div className="flex flex-wrap gap-18 mt-6 md:justify-start justify-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.itemId} product={product} />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { name, img, price, discount, description, itemId, rating } = product;
  const navigate = useNavigate();

  const handleMenuItemClick = (id) => {
    navigate(`/product/item?id=${id}`);
  };

  return (
    <div
      className="border border-gray-300 rounded-md px-4 py-3  bg-white w-[220px] flex-shrink-0 cursor-pointer"
      onClick={() => handleMenuItemClick(itemId)}
    >
      <div className="group flex items-center justify-center px-2 h-40 overflow-hidden">
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
          {Array(5)
            .fill('')
            .map((_, i) =>
              rating > i ? (
                <svg
                  key={i}
                  width="14"
                  height="13"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                    fill="#4FBF8B"
                  />
                </svg>
              ) : (
                <svg
                  key={i}
                  width="14"
                  height="13"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z"
                    fill="#4FBF8B"
                    fillOpacity="0.35"
                  />
                </svg>
              )
            )}
          <p>({rating})</p>
        </div>

        <div className="flex items-end justify-between mt-3">
          <p className="text-[#4FBF8B] font-semibold text-2xl flex items-center">
            <IndianRupee className="h-4.5 w-4.5 mt-1" />
            {discount > 0 ? (
              <>
                <strike>{price}</strike>
                <span className="ms-2">{calculateDiscount(price, discount)}</span>
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

export default Allproduct;

import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { serverUrlAPI } from '../../utils/Infos';
import { axiosInstance } from '../../utils/axiosInstance';

function Addproduct() {
   const [product, setProduct] = useState({
    img: '',
    name: '',
    description: '',
    about: '',
    category: '',
    price: '',
    discount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProductData = async (data) => {
    console.log(data)
    const response = await axiosInstance.post(serverUrlAPI+`products/add`, data);
    return response.data;
  };

  const mutation = useMutation({
    mutationKey: ['add-product'],
    mutationFn: addProductData,
    onSuccess: () => {
      toast.success('Product Added Successfully');
      setProduct({
        img: '',
        name: '',
        description: '',
        about: '',
        category: '',
        price: '',
        discount: '',
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to add product');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(product);
  };

  return (
    <div className="flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Image</label>
          <input
            type="text"
            name="img"
            placeholder="Type here"
            onChange={handleChange}
            value={product.img}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            onChange={handleChange}
            value={product.name}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <input
            type="text"
            name="description"
            placeholder="Type here"
            onChange={handleChange}
            value={product.description}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">About Product</label>
          <textarea
            name="about"
            rows={3}
            placeholder="Type here"
            onChange={handleChange}
            value={product.about}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            name="category"
            onChange={handleChange}
            value={product.category}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            <option value="fruit">fruit</option>
            <option value="vegetable">vegetable</option>
            <option value="grain">grain</option>
            <option value="plant">plant</option>
            <option value="seed">seed</option>
          </select>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Product Price</label>
            <input
              type="text"
              name="price"
              placeholder="0"
              onChange={handleChange}
              value={product.price}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
              
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Discount</label>
            <input
              type="text"
              name="discount"
              placeholder="0"
              onChange={handleChange}
              value={product.discount}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
             
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-[#4FBF8B] text-white font-medium rounded hover:bg-[#45a07a] cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
}

export default Addproduct;

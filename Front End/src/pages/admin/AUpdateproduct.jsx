import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../utils/axiosInstance';
import { serverUrlAPI } from '../../utils/Infos';

function AUpdateproduct() {
  const { itemId } = useParams();

  const [product, setProduct] = useState(null); // Start with null

  const fetchProduct = async () => {
    const response = await axiosInstance.get(`${serverUrlAPI}products/${itemId}`);
    return response.data;
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['update', itemId],
    queryFn: fetchProduct,
    enabled: !!itemId,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setProduct({
        img: data.img || '',
        name: data.name || '',
        description: data.description || '',
        about: data.about || '',
        category: data.category || '',
        price: data.price?.toString() || '',
        discount: data.discount?.toString() || '',
      });
    }
  }, [isSuccess, data]);

  const updateProductData = async (updatedData) => {
    const response = await axiosInstance.put(`${serverUrlAPI}products/update/${itemId}`, updatedData);
    return response.data;
  };

  const mutation = useMutation({
    mutationKey: ['update-product'],
    mutationFn: updateProductData,
    onSuccess: () => {
      toast.success('Product Updated Successfully');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update product');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(product);
  };

  if (isLoading || product === null) return <div className="p-5 text-lg">Loading...</div>;
  if (isError) return <div className="p-5 text-lg text-red-500">Failed to load product data</div>;

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
          className="px-8 py-2.5 bg-[#4FBF8B] text-white font-medium rounded hover:bg-[#45a07a]"
        >
          UPDATE
        </button>
      </form>
    </div>
  );
}

export default AUpdateproduct;

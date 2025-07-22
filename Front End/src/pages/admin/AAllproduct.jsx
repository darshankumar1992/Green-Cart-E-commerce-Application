import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../utils/axiosInstance';
import { serverUrlAPI } from '../../utils/Infos';
import toast from 'react-hot-toast';

function AAllproduct() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  const fetchAllProduct = async () => {
    const response = await axiosInstance.get(`${serverUrlAPI}product/all`);
    return response.data;
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProduct,
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      console.log(updatedData)
      const response = await axiosInstance.put(`${serverUrlAPI}products/update`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product updated");
      setShowModal(false);
      queryClient.invalidateQueries(['allProducts']);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const handleRowClick = (product) => {
    setSelectedProduct({ ...product }); // copy to allow editing
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(selectedProduct);
  };

  return (
    <div className="flex-1 py-3 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h1 className="pb-4 text-lg font-medium text-center md:text-left">All Products</h1>
        <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-auto w-full text-sm">
            <thead className="text-gray-900 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left">Price (₹)</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Discount (%)</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Rating</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 cursor-pointer">
              {data.map((product) => (
                <tr key={product.itemId} className="border-t border-gray-300" onClick={() => handleRowClick(product)}>
                  <td className="px-4 py-3">
                    <img src={product.img} alt={product.name} className="md:w-18 md:h-18 w-12 h-12 object-cover rounded border border-gray-300" />
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{product.category || 'N/A'}</td>
                  <td className="px-4 py-3">{product.price}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{product.discount}%</td>
                  <td className="px-4 py-3 hidden md:table-cell">{product.rating} / 5</td>
                </tr>
              ))}
              {data.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
          <section
            className="fixed inset-0 z-[999] bg-black/30 bg-opacity-50 flex justify-center items-center"
            onClick={() => setShowModal(false)}
          >
          <article
            className="bg-white rounded-xl p-5 md:w-[400px] w-[300px] shadow-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
              <h2 className="text-lg font-semibold text-center">Edit Product</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">

                <div className="flex gap-4 items-start">
                 
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      className="md:w-30 md:h-30 w-16 h-16 object-cover rounded border border-gray-300"
                    />
                  </div>

                  <div className='flex flex-col gap-3'>
                    <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedProduct.name}
                      onChange={handleChange}
                      className="w-full border border-gray-400 px-3 py-2 rounded"
                      required
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleChange}
                    className="w-full border border-gray-400 px-3 py-2 rounded"
                  />
                </div>



                  </div>
                  
                </div>

                

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    name="about"
                    value={selectedProduct.about}
                    onChange={handleChange}
                    className="w-full border border-gray-400 px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={selectedProduct.category}
                    onChange={handleChange}
                    className="w-full border border-gray-400 px-3 py-2 rounded"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={selectedProduct.price}
                      onChange={handleChange}
                      className="w-full border border-gray-400 px-3 py-2 rounded"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={selectedProduct.discount}
                      onChange={handleChange}
                      className="w-full border border-gray-400 px-3 py-2 rounded"
                    />
                  </div>
                </div>

                <footer className="flex justify-center items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-1.5 text-sm rounded-lg border border-gray-400 text-black hover:bg-gray-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-sm rounded-lg bg-black text-[#4FBF8B] hover:bg-[#4FBF8B] hover:text-black transition cursor-pointer"
                  >
                    Update
                  </button>
                </footer>
              </form>
            </article>
          </section>
        )}

    </div>
  );
}

export default AAllproduct;

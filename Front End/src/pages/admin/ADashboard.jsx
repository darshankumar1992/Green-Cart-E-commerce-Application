import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../utils/axiosInstance';
import { serverUrlAPI } from '../../utils/Infos';
import { IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ADashboard() {
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    const response = await axiosInstance.get(`${serverUrlAPI}order/getRevenue`);
    return response.data;
  };

  const fetchTopFive = async () => {
    const response = await axiosInstance.get(`${serverUrlAPI}product/topFive`);
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: topProducts = [] } = useQuery({
    queryKey: ['topfive'],
    queryFn: fetchTopFive,
  });

  const calculateDiscount = (price, discount) => {
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice.toFixed(2);
  };

  

  if (isLoading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (isError) return <div className="p-4 text-center text-red-500">Failed to load dashboard data.</div>;

  const revenueData = data?.revenue || {};
  const totalPending = data?.totalPending ?? 0;
  const totalUser = data?.totalUser ?? 0;

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md p-6 rounded-xl text-center border border-gray-200">
          <p className="text-gray-500 text-sm ">Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">₹{revenueData.revenue}</h2>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl text-center border border-gray-200">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold">{revenueData.orders}</h2>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl text-center border border-gray-200">
          <p className="text-gray-500 text-sm">Total Customers</p>
          <h2 className="text-2xl font-bold">{totalUser}</h2>
        </div>
        <div className="bg-white shadow-md p-6 rounded-xl text-center border border-gray-200">
          <p className="text-gray-500 text-sm">Pending Deliveries</p>
          <h2 className="text-2xl font-bold text-yellow-500">{totalPending}</h2>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <div className="flex flex-wrap gap-6">
          {topProducts.map((product) => {
            const { itemId, name, img, price, discount, description, rating } = product;
            return (
              <div
                key={itemId}
                className="border border-gray-300 rounded-md px-4 py-3 bg-white w-[220px] flex-shrink-0 cursor-pointer"
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

                  

                  <div className="flex items-end justify-between mt-3">
                    <p className="text-[#4FBF8B] font-semibold  text-2xl flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {discount > 0 ? (
                        <>
                          <strike className="text-sm text-[#4FBF8B] me-2">{price}</strike>
                          <span>{calculateDiscount(price, discount)}</span>
                        </>
                      ) : (
                        <span>{price}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ADashboard;

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../utils/axiosInstance';
import { serverUrlAPI } from '../../utils/Infos';
import { toast } from 'react-toastify';

function AOrders() {
  const fetchAllOrders = async () => {
    const response = await axiosInstance.get(`${serverUrlAPI}order/getAllOrder`);
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchAllOrders,
  });

  const orders = data?.orders || [];

  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (orders.length > 0) {
      const initialStatus = {};
      orders.forEach((order) => {
        initialStatus[order.orderId] = order.status;
      });
      setStatusMap(initialStatus);
    }
  }, [orders]);

  const handleStatusClick = async (orderId) => {
    const current = statusMap[orderId];
    let next;

    if (current === 'Pending') next = 'Transit';
    else if (current === 'Transit') next = 'Delivered';
    else return;

    setStatusMap((prev) => ({
      ...prev,
      [orderId]: next,
    }));

    if (next === 'Delivered') {
      const order = orders.find(o => o.orderId === orderId);
      const totalAmount = order.totalAmount;
      try {
        await axiosInstance.put(`${serverUrlAPI}order/updateStatus`, {
          orderId,
          status: next,
          totalAmount: totalAmount,
        });
        toast.success('Order marked as Delivered');
      } catch (error) {
        toast.error('Failed to update status');
        console.error(error);
      }
    }
  };

  return (
    <div className="flex-1 py-3 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h1 className="pb-4 text-lg font-medium text-center md:text-left">All Orders</h1>
        <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-auto w-full text-sm">
            <thead className="text-gray-900 text-sm ">
              <tr>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-left">Product</th>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-left hidden md:table-cell">Quantity</th>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-left">Total</th>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-left hidden md:table-cell">Order Date</th>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-left hidden md:table-cell">Delivery Address</th>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-left hidden md:table-cell">Payment Mode</th>
                <th className="px-2 sm:px-3 md:px-4 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {orders.map((order) =>
                order.orderItem.map((item, idx) => (
                  <tr key={`${order.orderId}-${idx}`} className="border-t border-gray-300">
                    
                    <td className="px-2 sm:px-3 md:px-4 py-3">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="border border-gray-300 rounded p-1 flex-shrink-0">
                          <img
                            src={item.productItem.img}
                            alt={item.productItem.name}
                            className="w-12 h-12 md:w-18 md:h-18 object-cover"
                          />
                        </div>
                        <span className="truncate font-medium">{item.productItem.name}</span>
                      </div>
                    </td>

                    
                    <td className="px-2 sm:px-3 md:px-4 py-3 hidden md:table-cell">
                      {item.orderDetails.quantity}
                    </td>

                    
                    <td className="px-2 sm:px-3 md:px-4 py-3">₹{order.totalAmount}</td>

                    
                    <td className="px-2 sm:px-3 md:px-4 py-3 hidden md:table-cell">
                      {new Date(order.date).toLocaleDateString()}
                    </td>

                    
                    <td className="px-2 sm:px-3 md:px-4 py-3 hidden md:table-cell">
                      {order.deliveryAddress}
                    </td>

                    
                    <td className="px-2 sm:px-3 md:px-4 py-3 hidden md:table-cell">{order.payMode}</td>

                   
                    <td className="px-2 sm:px-3 md:px-4 py-3 text-center">
                      <button
                        onClick={() => handleStatusClick(order.orderId)}
                        className={`px-3 py-1 rounded text-white text-xs md:text-sm cursor-pointer ${
                          statusMap[order.orderId] === 'Pending'
                            ? 'bg-red-500'
                            : statusMap[order.orderId] === 'Transit'
                            ? 'bg-yellow-400 text-black'
                            : 'bg-green-600'
                        }`}
                      >
                        {statusMap[order.orderId]}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AOrders;

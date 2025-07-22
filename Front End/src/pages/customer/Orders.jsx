import React, { useState } from 'react'
import { useInfiniteQuery, useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from '../../utils/axiosInstance';
import { serverUrlAPI } from '../../utils/Infos';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Orders() {

    const ORDER_PAGE_LIMIT = 5;
    const queryClient = useQueryClient();



    const getOrders = async ({pageParam = 1}) =>{
        const id = queryClient.getQueryData(["profile"])?.id || 0;

        const response = await axiosInstance.get(`${serverUrlAPI}order/user`,{
            params: {
                page: pageParam,
                limit: ORDER_PAGE_LIMIT,
                id
            },
        });

        console.log(response.data);

        return {
            ...response?.data,
            prevParam: pageParam,
        };
    };

    const {
        data: ordersData,
        isLoading : orderLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey:["orders"],
        queryFn: getOrders,
        getNextPageParam: (lastPage) => {
            const prevPage = lastPage.prevParam;
            const { totalPages } = lastPage.pagination;
            if (prevPage === totalPages) {
              return undefined;
            }
            return prevPage + 1;
          },
          refetchOnWindowFocus: false,
        });

        if (orderLoading) {
          return (
            <section className="w-full h-screen flex justify-center items-center">
              <span className="text-gray-600">Data Fetching…</span>
            </section>
          );
        }

        const orderListItem = ordersData?.pages?.reduce((result, page) => {
            return [...result, ...page?.orders];
        }, []);

  console.log(orderListItem);

  return (
    <>
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 md:mx-20 mt-[60px]'>
        <div className='flex flex-col w-[150px] items-end mb-[20px]'>
          <h1 className='text-gray-700 text-2xl font-medium'>MY ORDERS</h1>
          <div className='w-16 h-0.5 bg-[#4FBF8B] rounded-full '></div>
        </div>
        {orderListItem?.length === 0 ? 
        
              <section className="w-full h-screen flex justify-center mt-[150px]">
               <span>No Orders Found</span>
              </section> 
              : 
              <section>
                 {orderListItem?.map((order, index) => (
                    <OrderItemCard key={index} data={order} />
                 ))}

                 {hasNextPage && (
                    <div className="w-full flex justify-center items-center mt-3">
                        <span
                        className="text-[0.8rem] text-gray-600 cursor-pointer"
                        onClick={fetchNextPage}
                        >
                        Load More
                        </span>
                    </div>
                 )}
            </section>}
        <div>

        </div>
    </div>
    </>
  )
}



export default Orders

const OrderItemCard = ({ data }) => {
    
    const [cancelModel, setCancelModel] =useState(false);
    const { orderItem, status, orderId, totalAmount, payMode, deliveryAddress, date } = data;
    
    const { productItem } = orderItem[0];
    const { name, img, description, itemId } = productItem;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleCardClick = () => {
        navigate(`/product/item?id=${itemId}`);
    };

    const handleCancelMutation = useMutation({
        mutationKey: ['order-cancel'],
        mutationFn: () =>
            axiosInstance.delete(`${serverUrlAPI}order/`, {
                params: { orderId },
            }),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setCancelModel(false);
        toast.success("Order cancelled successfully!");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return (
        <>
        <div className="md:mx-4 md:w-[1200px] mx-2 md:p-4 p-2 cursor-pointer">
          <div className="flex flex-col md:flex-row md:justify-around gap-4 p-4 rounded-md border border-gray-300 text-gray-800 flex-wrap">

            
            <div className="flex gap-7 items-center" onClick={handleCardClick}>
              <img className="w-20 h-20 object-cover" src={img} alt={name} />
              <div className="flex flex-col justify-center">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{description}</p>
                
              </div>
            </div>

            
            <div className="flex flex-col justify-center">
              <p className="text-sm">Delivery Address</p>
              <p className="font-medium mb-1">{deliveryAddress}</p>
            </div>

            
            <div className="flex flex-col justify-center">
              <p className="font-medium text-base text-black/70">₹{totalAmount}</p>
            </div>

            
            <div className="flex flex-col justify-center text-sm">
              <p>Method: {payMode}</p>
              {status == "Delivered" 
                  ?  <p >Status:<span className='text-green-600'>{status}</span> </p> 
                 : <p>Status: <span className='text-red-500'>{status}</span></p>}
              <p>Date: {date}</p>
            </div>

            
            {status === "Pending" ? (
              <div className="flex items-center">
                <button
                  className="text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-600 hover:text-white transition cursor-pointer"
                  onClick={() => setCancelModel(true)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="w-[100px]"></div> // Empty block to align the layout
            )}
          </div>
        </div>

        {cancelModel && (
        <section
          className="fixed inset-0 z-[999] bg-black/30 bg-opacity-50 flex justify-center items-center "
          onClick={() => setCancelModel(false)}
        >
          <article
            className="bg-white rounded-xl p-5 w-full max-w-[350px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-800 font-medium text-center">
              Do you want to cancel this order?
            </p>

            <footer className="flex justify-center items-center mt-6 gap-4 ">
              <button
                className="px-4 py-1.5 text-sm rounded-lg border border-[#4FBF8B] text-[black] hover:bg-[#4FBF8B] transition cursor-pointer"
                onClick={() => setCancelModel(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 text-sm rounded-lg bg-[black] text-[#4FBF8B] hover:bg-[#4FBF8B] hover:text-black transition cursor-pointer"
                onClick={() => handleCancelMutation.mutate()}
              >
                Confirm
              </button>
            </footer>
          </article>
        </section>
      )}
        </>
    );
};

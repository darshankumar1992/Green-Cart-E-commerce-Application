import React, { useState, useEffect, useRef } from "react";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { calculateDiscount } from "../../utils/CalculateDiscount";
import { CircleX, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cartDetails, setCartDetails] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [payment, setPaymentOption] = useState("");
  const [orderCaptcha, setOrderCaptcha] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const captchInputRef = useRef();

  // 1. Fetch cart data
  const getCartItems = async () => {
    const profileQuery = queryClient.getQueryData(["profile"]);
    const id = profileQuery?.id || 0;
    const response = await axiosInstance.get(`${serverUrlAPI}cart/`, {
      params: { id },
    });
    console.log(response.data);
    return response.data;
  };

  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  // 2. Show toast error using useEffect (not during render)
  useEffect(() => {
    if (isError) {
      toast.error(getErrorMessage(error));
    }
  }, [isError, error]);

  // 3. Set cartDetails for UI rendering
  useEffect(() => {
    if (cartData) {
      const filterData = cartData.map((data) => {
        const { price, discount } = data.productItem;
        return {
          cartId: data.cartId,
          quantity: 1,
          price: calculateDiscount(price, discount),
          productItem: data.productItem,
        };
      });
      setCartDetails(filterData);
    }
  }, [cartData]);

  // 4. Set total quantities and checkout amount
  useEffect(() => {
    if (cartDetails && Array.isArray(cartDetails)) {
      const quantity = cartDetails.reduce((total, item) => total + item.quantity, 0);
      setTotalQuantity(quantity);
  
      const totalCartAmount = cartDetails.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
  
      setCartAmount(totalCartAmount);
    }
  }, [cartDetails]);
  

  
  const handleIncrementQuantity = (itemId) => {
    const updatedDetails = cartDetails.map(item => {
      if (item.productItem.itemId === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartDetails(updatedDetails);
  };
  
  const handleDecrementQuantity = (itemId) => {
    const updatedDetails = cartDetails.map(item => {
      if (item.productItem.itemId === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartDetails(updatedDetails);
  };
  

  

     useEffect(() => {
          const tax = cartAmount * 0.02;
          setTaxAmount(tax);
          setTotalAmount(cartAmount + tax);
      }, [cartAmount]);



  const handlePlaceOrderClick = () => {
    
    if(!cartDetails || cartDetails.length === 0){ 
        toast.error("Cart is Empty")
        return;
    }
    if (!deliveryAddress) {  
        toast.error("Delivery address required");
        return;
    }
    if (!payment) {
        toast.error("Choose Payment Option");
        return;
    }

    setOrderCaptcha(generateCaptcha(6));
    setOpenModal(true);
};
const createItemOrder = async () => {
        
    const userId = queryClient.getQueryData(["profile"])?.id || 0;
    
    const data = {
        mode: payment,
        deliveryAddress,
        totalAmount,
        userId,
        cartAmount,
        source: "cart",
        items: cartDetails.map((item) => {
            const { quantity, productItem } = item;
            const { itemId } = productItem;
            return {
                itemId,
                quantity,
            };
        }),
    };

    const response = await axiosInstance.post(`${serverUrlAPI}order/`, data);
    return response.data;
};

const createItemOrderMutation = useMutation({
    mutationFn: createItemOrder,
    onSuccess: () => {
        setTimeout(()=>{
            toast.success("Order Successfull")
             navigate("/payment/success");
        },1000);
    },
    onError: () => {
        toast.error("Failed to place order");
    },
});

   

const handleConfirmClick = () =>{
    if (!captchInputRef.current.value) {
        toast.error("Captcha required!");
        return;
    }

    if (captchInputRef.current.value !== orderCaptcha) {
        toast.error("Invalid Captcha!");
        return;
    }

    setTimeout(() => {
        setOpenModal(false);
    }, 800);

    createItemOrderMutation.mutate();

}
const deleteCartMutation = useMutation({
  mutationKey: ["cart-delete"],
  mutationFn: (cartId) =>
    axiosInstance.delete(`${serverUrlAPI}cart/`, {
      params: { cartId },
    }),
  onSuccess: () => {
    toast.success("Item removed from cart successfully!");
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
  onError: (error) => {
    toast.error(getErrorMessage(error));
  },
});


  
//   if (isLoading) return <p className="text-center py-10">Loading cart...</p>;
//   if (isError) return <p className="text-center py-10 text-red-500">Error loading cart.</p>;

  return (
    <>
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6 text-gray-700">
          Shopping Cart <span className="text-sm text-[#4FBF8B]">{totalQuantity} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-700 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartDetails &&
          cartDetails.map((data, index) => {
            const cartId = data.cartId;
            const product = data.productItem;
            const quantity = data.quantity;
            const subtotal = calculateDiscount(product.price, product.discount) * quantity;
            return (
              <div
                key={index}
                className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
              >
                <div className="flex items-center md:gap-6 gap-3">
                  <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                    <img className="max-w-full h-full object-cover" src={product.img} alt={product.name} />
                  </div>
                  <div>
                    <p className="hidden md:block font-semibold">{product.name}</p>
                    <div className="font-normal text-gray-500/70">
                      <div className="flex w-full flex-col">
                        <div className="flex items-center gap-2 mt-1">
                          <p>Qty: </p>
                          <button
                            onClick={() => handleDecrementQuantity(product.itemId)}
                            className="px-2 py-1 text-sm cursor-pointer"
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            onClick={() => handleIncrementQuantity(product.itemId)}
                            className="px-2 py-1 text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center">₹ {subtotal.toFixed(2)}</p>
                <button className="cursor-pointer mx-auto" 
                onClick={() => deleteCartMutation.mutate(cartId)}
                disabled={deleteCartMutation.isPending}>
                  <CircleX className="text-red-400" />
                </button>
              </div>
            );
          })}

        <button className="group cursor-pointer flex items-center mt-8 gap-2 text-[#4FBF8B] font-medium">
          
          <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          Continue Shopping
        </button>
      </div>
      <div className="max-w-[360px] w-full h-[600px] bg-gray-100/90 p-5 max-md:mt-16 border border-gray-300/70">
                    <h2 className="text-xl md:text-2xl text-gray-700 font-medium">Order Summary</h2>
                    <hr className="border-gray-300 my-5" />

                    <div className="mb-6">
                        <p className="text-sm font-medium uppercase text-gray-700">Delivery Address</p>
                        <input
                            type="text"
                            placeholder="Enter the address"
                            className="w-full border border-gray-300 px-3 py-2 rounded outline-none focus:ring-2 focus:ring-[#4FBF8B]"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                        />

                        <p className="text-sm font-medium uppercase mt-6 text-gray-700">Payment Method</p>
                        <select
                            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none text-gray-700"
                            value={payment}
                            onChange={(e) => setPaymentOption(e.target.value)}
                        >
                            <option value="">Select Payment Method</option>
                            <option value="COD">Cash On Delivery</option>
                            <option value="Online">Online Payment</option>
                        </select>
                    </div>

                    <hr className="border-gray-300" />

                    <div className="text-gray-500 mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Price</span><span> {cartAmount}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Shipping Fee</span><span className="text-green-600">Free</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Tax (2%)</span><span>₹ {taxAmount}</span>
                        </p>

                        <p className="flex justify-between text-lg font-medium mt-3">
                            <span>Total Amount:</span><span>₹ {totalAmount}</span>
                        </p>
                    </div>

                    <button
                        className="w-full py-3 mt-6 cursor-pointer bg-[#4FBF8B] text-white font-medium hover:bg-emerald-500 transition"
                        onClick={handlePlaceOrderClick}
                    >
                        Place Order
                    </button>
                </div>
     </div>
       {openModal && (
                <section
                    className="fixed inset-0 z-[999] bg-black/30 bg-opacity-50 flex justify-center items-center"
                    onClick={() => setOpenModal(false)}
                >
                    <article
                        className="w-[300px] md:w-[400px] bg-white p-4 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1 className="text-[1.4rem] font-semibold">Confirm Order</h1>
                        <h1 className="mt-4">Enter the captcha</h1>

                        <h1 className="p-3 bg-black text-white rounded-lg mt-2 font-semibold">
                            {orderCaptcha}
                        </h1>

                        <input
                            type="text"
                            className="mt-3 border border-[#efefef] rounded-md p-2 w-full"
                            ref={captchInputRef}
                        />

                        <div className="flex mt-3 justify-start items-center gap-3">
                            <button
                                className="px-4 py-1.5 text-sm rounded-lg bg-[black] text-[#4FBF8B] hover:bg-[#4FBF8B] hover:text-black transition cursor-pointer"
                                onClick={handleConfirmClick}
                            >
                                Confirm
                            </button>
                            <button
                                className="px-4 py-1.5 text-sm rounded-lg border border-[#4FBF8B] text-[black] hover:bg-[#4FBF8B] transition cursor-pointer"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </article>
                </section>
            )}
    </>
  );
}
const generateCaptcha = (length = 5) => {
    const data = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";

    for (let i = 0; i < length; i++) {
        captcha += data.charAt(Math.floor(Math.random() * data.length));
    }
    return captcha;
};

export default Cart;

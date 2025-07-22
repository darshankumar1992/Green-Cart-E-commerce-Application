import React,{useEffect} from 'react'
import orderConfirm from '../../assets/orderConfirm.gif'
import {useNavigate} from 'react-router-dom'

function OrderSuccess() {
    const navigate = useNavigate();

    const handleOrderClick=()=>{
        navigate("/all")

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/all");
        }, 12000);
    
        return () => clearTimeout(timer);
    }, [navigate]);
    

  return (
    <>
    <div className='w-full h-[80vh] flex justify-center items-center flex-col'>
         <img src={orderConfirm} className='w-[400px] h-[400px]'></img>
         <span className='cursor-pointer text-xl text-gray-700' onClick={handleOrderClick}>Go back</span>

    </div>
    </>
  )
}

export default OrderSuccess
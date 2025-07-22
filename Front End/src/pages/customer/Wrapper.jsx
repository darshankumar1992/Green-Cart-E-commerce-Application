import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { axiosInstance } from '../../utils/axiosInstance';
import { serverUrl } from '../../utils/Infos';

const fetchCustomerData = async () => {
  const response = await axiosInstance.get(`${serverUrl}auth/user/profile`);
  console.log(response.data);
  return response.data;
};

const Wrapper = () => {
  const token = localStorage.getItem('token');

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchCustomerData,
    enabled: !!token, // fetch only if token is available
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (profile) {
      sessionStorage.setItem('user', JSON.stringify(profile));
      console.log('User profile stored in session:', profile);
    }
  }, [profile]);

  useEffect(() => {
    if (isError) {
      console.error('Failed to fetch user profile:', error);
    }
  }, [isError, error]);

  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Wrapper;

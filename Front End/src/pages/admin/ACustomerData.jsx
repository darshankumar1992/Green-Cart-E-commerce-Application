import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../utils/axiosInstance';
import React, { useState } from 'react';
import { serverUrl } from '../../utils/Infos';

function ACustomerData() {
  const [error, setError] = useState("");

  const fetchCustomer = async () => {
    const response = await axiosInstance.get(`${serverUrl}auth/admin/userData`);
    return response.data;
  };

  const {
    data: user = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['customer'],
    queryFn: fetchCustomer,
    onError: (err) => setError("Failed to fetch customer data"),
  });

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium text-center md:text-left">All Customers</h2>

        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-300">
          <table className="w-full table-auto text-sm">
            <thead className="text-gray-900 ">
              <tr>
                <th className="px-3 py-3 md:px-4 font-semibold text-left">Name</th>
                <th className="px-3 py-3 md:px-4 font-semibold text-left">Email</th>
                <th className="px-3 py-3 md:px-4 font-semibold text-left hidden md:table-cell">Phone</th>
                <th className="px-3 py-3 md:px-4 font-semibold text-left hidden md:table-cell">Address</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {user.map((user, index) => (
                <tr key={index} className="border-t border-gray-200">
                  
                  <td className="px-3 md:px-4 py-3 truncate">
                    <span className="font-medium">{user.name}</span>
                  </td>

                  
                  <td className="px-3 md:px-4 py-3 truncate">{user.email}</td>

                  
                  <td className="px-3 md:px-4 py-3 hidden md:table-cell">
                    {user.phoneNumber}
                  </td>

                  
                  <td className="px-3 md:px-4 py-3 hidden md:table-cell">
                    {user.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Loading and Error States */}
          {isLoading && (
            <p className="text-gray-500 py-4">Loading customers...</p>
          )}
          {isError && (
            <p className="text-red-500 py-4">{error || "An error occurred"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ACustomerData;

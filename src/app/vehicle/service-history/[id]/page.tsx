'use client'; // Ensure this component is client-side

import React, { useEffect, useState } from 'react';
import {useParams} from 'next/navigation'
import axios from 'axios';
import { ServiceHistory } from '@/app/models/types';

const ServiceHistoryPage = () => {

  const [tableData, setTableData] = useState<ServiceHistory[]>([])


  const {id} = useParams();

  useEffect(()=>{
    fetchHistoryData()
  },[id])

  const fetchHistoryData =async()=>{
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token is missing');
        return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
      const result = await axios.get<ServiceHistory[]>(`http://localhost:8080/api/v1/service_activity/search-service-history?idVehicle=`+id, {headers})

      if(result.status==200){
        console.log(result.data)
        setTableData(result.data.data)
      }
    } catch (error) {
      
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 bg-gradient-to-r from-[#001A6E] via-[#001A6E] to-[#001A6E] text-transparent bg-clip-text shadow-md tracking-wide">
        Vehicle Service Details
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-gray-600 font-semibold">Service ID</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Service Type</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Service Date</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr
                key={item.idService}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-2 text-gray-700">{item.idService}</td>
                <td className="px-4 py-2 text-gray-700">{item.serviceType}</td>
                <td className="px-4 py-2 text-gray-700">{item.serviceDate}</td>
                <td className="px-4 py-2 text-gray-700">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-6 py-2 bg-[#001A6E] text-white rounded-lg hover:bg-[#8174A0] transition duration-300">
          Add New Service
        </button>
      </div>
    </div>
  );
};

export default ServiceHistoryPage;

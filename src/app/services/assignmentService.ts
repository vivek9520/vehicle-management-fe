import axios, { AxiosResponse } from 'axios';
import { ApiResponse, AssignPayload } from '../models/assignmentTypes';
import { getAuthToken } from '../utils/auth';
import { AssignmentData, Employee, Mobile, Vehicle } from '../models/types';
import { toast } from 'react-toastify';


const API_BASE_URL = 'http://localhost:8080/api/v1';

export const assignItem = async ( payload:AssignPayload):Promise<ApiResponse> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/assign/save`;
  try{
   const response: AxiosResponse<ApiResponse> = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data
  }catch(error:any){
    console.error('Error in assignItem:', error);
    throw new Error(error?.response?.data?.message || 'Failed to assign item');
  }
   
};

// Update Status function
export const updateStatus = async (
  type: string, 
  itemId: number, 
  status: string
): Promise<ApiResponse> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/${type}/${itemId}/status?status=${status}`;
  try {
    const response: AxiosResponse<ApiResponse> = await axios.put(url, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error in updateStatus:', error);
    throw new Error(error?.response?.data?.message || 'Failed to update status');
  }
};

// Fetch Assign Data function
export const fetchAssignData = async (
  empId: number
): Promise<AssignmentData> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/assign/employee/${empId}`;
  try {
    const response: AxiosResponse<{data:AssignmentData}> = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(response.status===200){
      return response.data.data;
    }else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    
  } catch (error: any) {
    console.error('Error in fetchAssignData:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch assignment data');
  }
};



export const fetchMobileOptions = async (
  query: string,
): Promise<Mobile[]> => {
  const token = getAuthToken();

  const url = `${API_BASE_URL}/mobile/search?mobileNumber=${query}`;
  
  try {
    const response: AxiosResponse<{data:Mobile[]}> = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error:any) {
    throw new Error(error?.response?.data?.message || 'Failed to fetch mobile options');
  }
};

export const fetchVehicleOptions = async (
  query: string,
): Promise<Vehicle[]> => {
  const token = getAuthToken();

  const url = `${API_BASE_URL}/vehicle/search?registrationNo=${query}`;

  try {
    const response: AxiosResponse<{ data: Vehicle[] }> = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error:any) {
    throw new Error(error?.message || 'Failed to fetch vehicle options');
  }
};


// Service function to fetch employee data
export const fetchEmployeeList = async (): Promise<Employee[]> => {
  const token = getAuthToken();

  const url = `${API_BASE_URL}/employee/search`;

  try {
    const response: AxiosResponse<{ data: Employee[] }> = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to fetch employee list');
  }
};


// Reset Assignment Data function
export const resetAssignmentData = async (
  assignId: number,
  assignmentType: 'mobile' | 'vehicle'
): Promise<void> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/assign/reset/${assignId}/${assignmentType}`;

  try {
    const response: AxiosResponse = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      toast.success('Assignment has been successfully reset');
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error in resetAssignmentData:', error);
    throw new Error(error?.response?.data?.message || 'Failed to reset assignment data');
  }
};


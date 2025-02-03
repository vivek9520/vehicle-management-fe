'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface Employee {
  idEmployee: number;
  uniqueId: string;
  employeeName: string;
  status: string;
}

interface Item {
  id: number;
  uniqueId: string;
  mobileModel?: string;
  status: string;
  mobileNumber: string;
}

interface MobileAssignRequest {
  mobileId: number;
  isPermanentMobile: boolean;
}

interface VehicleAssignRequest {
  vehicleId: number;
  isPermanentVehicle: boolean;
}

interface AssignRequest {
  employeeId: number;
  type: string[]; // Array of "mobile" or "vehicle"
  mobileAssignRequest?: MobileAssignRequest;
  vehicleAssignRequest?: VehicleAssignRequest;
}


const EmployeeSearch = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [mobileOptions, setMobileOptions] = useState<{ value: number; label: string; isDisabled: boolean }[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<{ value: number; label: string; isDisabled: boolean }[]>([]);
  const [showModal, setShowModal] = useState<'mobile' | 'vehicle' | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ value: number; label: string } | null>(null);
  const [isPermanent, setIsPermanent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/employee/search', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setEmployees(response.data.data);
        } else {
          setError('Error fetching employee list.');
        }
      } catch (err) {
        setError('Error fetching employee list.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const fetchOptions = async (type: 'mobile' | 'vehicle', query: string = '') => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }
  
    try {
      const url =
        type === 'mobile'
          ? `http://localhost:8080/api/v1/mobile/search?mobileNumber=${query}`
          : `http://localhost:8080/api/v1/vehicle/search?registrationNo=${query}`;
  
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        const items = response.data.data;
  
        const options = items.map((item: Item) => {
          // For mobile, use idMobile and mobileNumber
          if (type === 'mobile') {
            const isAvailable = item.status === 'AVAILABLE';
            return {
              value: item.idMobile,  // Use idMobile for mobile search
              label: `${item.uniqueId || ''} (${item.mobileNumber || ''}) - ${item.status}`,
              isDisabled: !isAvailable, // Disable options that are not "AVAILABLE"
            };
          }
  
          // For vehicle, use idVehicle and registrationNo
          if (type === 'vehicle') {
            const isAvailable = item.status === 'AVAILABLE';
            return {
              value: item.idVehicle,  // Use idVehicle for vehicle search
              label: `${item.uniqueId || ''} (${item.registrationNo || ''}) - ${item.status}`,
              isDisabled: !isAvailable, // Disable options that are not "AVAILABLE"
            };
          }
  
          return null;
        }).filter((option) => option !== null); // Remove any null values (safety check)
  
        options.sort((a, b) => (a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1)); // Sort available items to the top
  
        if (type === 'mobile') {
          setMobileOptions(options);
        } else {
          setVehicleOptions(options);
        }
      } else {
        setError(`Error fetching ${type} list.`);
      }
    } catch (err) {
      setError(`Error fetching ${type} list.`);
    }
  };
  

  const handleAssign = async () => {
    if (!selectedItem || !selectedEmployee) return;
  
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }
  
    try {
      const assignType = showModal === 'mobile' ? 'mobile' : 'vehicle';
  
      // Construct the request body based on the selected item type
      const payload: AssignRequest = {
        employeeId: selectedEmployee.idEmployee,
        type: [assignType], // "mobile" or "vehicle"
        mobileAssignRequest: showModal === 'mobile'
          ? {
              mobileId: selectedItem.value,
              isPermanentMobile: isPermanent,
            }
          : undefined,
        vehicleAssignRequest: showModal === 'vehicle'
          ? {
              vehicleId: selectedItem.value,
              isPermanentVehicle: isPermanent,
            }
          : undefined,
      };
  
      const response = await axios.post('http://localhost:8080/api/v1/assign/save', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        alert(`${assignType} assigned successfully!`);
        setShowModal(null);
        setSelectedItem(null);
        setIsPermanent(false);
      } else {
        setError(`Error assigning ${assignType}.`);
      }
    } catch (err) {
      setError('Error assigning item.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner-border text-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-400">Employee Search</h1>
      </div>

      <div className="mb-6">
        <Select
          options={employees.map((emp) => ({
            value: emp.idEmployee,
            label: `${emp.employeeName} (${emp.status})`,
          }))}
          onChange={(selectedOption) => {
            const employee = employees.find((emp) => emp.idEmployee === selectedOption?.value);
            setSelectedEmployee(employee || null);
          }}
          isClearable
          placeholder="Select an Employee"
          className="w-full"
        />
      </div>

      {error && <div className="bg-red-100 p-2 rounded-lg text-red-500">{error}</div>}

      {selectedEmployee && (
        <div className="border p-4 rounded-lg bg-gray-100">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Employee Details</h2>
          <p>
            <strong>Unique ID:</strong> {selectedEmployee.uniqueId}
          </p>
          <p>
            <strong>Name:</strong> {selectedEmployee.employeeName}
          </p>
          <p>
            <strong>Status:</strong> {selectedEmployee.status}
          </p>

          {selectedEmployee.status === 'Active' && (
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => {
                  setShowModal('mobile');
                  fetchOptions('mobile');
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Assign Mobile
              </button>
              <button
                onClick={() => {
                  setShowModal('vehicle');
                  fetchOptions('vehicle');
                }}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Assign Vehicle
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Assign {showModal === 'mobile' ? 'Mobile' : 'Vehicle'}
            </h2>
            <Select
              options={showModal === 'mobile' ? mobileOptions : vehicleOptions}
              onChange={(option) => {
                if (!option?.isDisabled) {
                  setSelectedItem(option);
                }
              }}
              isOptionDisabled={(option) => option.isDisabled}
              getOptionLabel={(option) =>
                option.isDisabled ? (
                  <span style={{ color: 'gray' }}>{option.label}</span>
                ) : (
                  <span>{option.label}</span>
                )
              }
              isClearable
              placeholder={`Select a ${showModal === 'mobile' ? 'Mobile' : 'Vehicle'}`}
              className="mb-4"
            />
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isPermanent}
                onChange={() => setIsPermanent(!isPermanent)}
                className="mr-2"
              />
              Permanent Assignment
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(null)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;

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
  status: string;
}

const EmployeeSearch = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [mobileOptions, setMobileOptions] = useState<{ value: number; label: string }[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<{ value: number; label: string }[]>([]);
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

  const fetchOptions = async (type: 'mobile' | 'vehicle') => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const availableItems = response.data.data.filter((item: Item) => item.status === 'Available');
        const options = availableItems.map((item: Item) => ({
          value: item.id,
          label: `${item.uniqueId} (Available)`,
        }));

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
      const payload = {
        employeeId: selectedEmployee.idEmployee,
        itemId: selectedItem.value,
        isPermanent,
      };

      const response = await axios.post(`http://localhost:8080/api/v1/employee/assign/${assignType}`, payload, {
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
          <p><strong>Unique ID:</strong> {selectedEmployee.uniqueId}</p>
          <p><strong>Name:</strong> {selectedEmployee.employeeName}</p>
          <p><strong>Status:</strong> {selectedEmployee.status}</p>

          {selectedEmployee.status === 'Active' && (
            <div className="mt-4 flex space-x-4">
  <button
    onClick={() => {
      setShowModal('mobile');
      fetchOptions('mobile');
    }}
    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-transform transform hover:scale-105 flex items-center space-x-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 6v2.25m9 0h-9m9 0v9.75a2.25 2.25 0 01-2.25 2.25h-4.5A2.25 2.25 0 017.5 18V8.25m9 0v1.5m-9 0v-1.5m0 1.5h9m-6 4.5h3"
      />
    </svg>
    <span>Assign Mobile</span>
  </button>

  <button
    onClick={() => {
      setShowModal('vehicle');
      fetchOptions('vehicle');
    }}
    className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition-transform transform hover:scale-105 flex items-center space-x-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3a3 3 0 00-3 3v12a3 3 0 003 3h4.5a3 3 0 003-3V6a3 3 0 00-3-3h-4.5zM7.5 10.5h9M7.5 13.5h9"
      />
    </svg>
    <span>Assign Vehicle</span>
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
              onChange={(option) => setSelectedItem(option)}
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
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
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

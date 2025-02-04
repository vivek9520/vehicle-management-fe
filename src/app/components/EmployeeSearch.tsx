'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import AssignModal from './AssignModal';
import EmployeeDetails from './EmployeeDetails';
import ConfirmationModal from './ConfirmationModal';


interface Employee {
  idEmployee: number;
  uniqueId: string;
  employeeName: string;
  status: string;
}

const EmployeeSearch: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState<'mobile' | 'vehicle' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token is missing.');
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
      } catch {
        setError('Error fetching employee list.');
      }
    };

    fetchEmployees();
  }, []);

  const handleAssign = async (type: 'mobile' | 'vehicle', itemId: number, isPermanent: boolean) => {
    if (!selectedEmployee) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    try {
      const payload = {
        employeeId: selectedEmployee.idEmployee,
        type: [type],
        ...(type === 'mobile'
          ? { mobileAssignRequest: { mobileId: itemId, isPermanentMobile: isPermanent } }
          : { vehicleAssignRequest: { vehicleId: itemId, isPermanentVehicle: isPermanent } }),
      };

      const response = await axios.post('http://localhost:8080/api/v1/assign/save', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert(`${type} assigned successfully!`);
        setShowModal(null);
      } else {
        setError(`Error assigning ${type}.`);
      }
    } catch {
      setError('Error assigning item.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-400 mb-6">Employee Search</h1>

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
        className="w-full mb-6"
      />

      {error && <div className="bg-red-100 p-2 rounded-lg text-red-500">{error}</div>}

      {selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onAssign={(type) => {
            setShowModal(type);
          }}
        />
      )}

      {showModal && (
        <AssignModal
          type={showModal}
          onClose={() => setShowModal(null)}
          onAssign={(itemId, isPermanent) => {
            setShowConfirmation(true);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Assignment"
        message={`Are you sure you want to assign this ${showModal} to ${selectedEmployee?.employeeName}?`}
        onConfirm={() => {
          setShowConfirmation(false);
          // Handle assign logic here
        }}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
};

export default EmployeeSearch;

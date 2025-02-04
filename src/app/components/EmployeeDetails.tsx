import React from 'react';

interface Employee {
  idEmployee: number;
  uniqueId: string;
  employeeName: string;
  status: string;
}

interface EmployeeDetailsProps {
  employee: Employee;
  onAssign: (type: 'mobile' | 'vehicle') => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onAssign }) => {
  return (
    <div className="border p-4 rounded-lg bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">Employee Details</h2>
      <p>
        <strong>Unique ID:</strong> {employee.uniqueId}
      </p>
      <p>
        <strong>Name:</strong> {employee.employeeName}
      </p>
      <p>
        <strong>Status:</strong> {employee.status}
      </p>

      {employee.status === 'Active' && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => onAssign('mobile')}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Assign Mobile
          </button>
          <button
            onClick={() => onAssign('vehicle')}
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Assign Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;

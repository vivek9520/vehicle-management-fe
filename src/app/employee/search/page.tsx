'use client';

import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import axios from 'axios';
import { AssignmentData, Employee, Mobile, Vehicle } from '@/app/models/types';
import { assignItem, fetchAssignData, fetchEmployeeList, fetchMobileOptions, fetchVehicleOptions, resetAssignmentData, updateStatus } from '@/app/services/assignmentService';
import { AssignPayload } from '@/app/models/assignmentTypes';


const EmployeeSearch: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [assignData, setAssignData] = useState<AssignmentData | null>(null);
  const [mobileOptions, setMobileOptions] = useState<{ value: number; label: string; isDisabled: boolean }[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<{ value: number; label: string; isDisabled: boolean }[]>([]);
  const [showModal, setShowModal] = useState<'mobile' | 'vehicle' | null>(null);
  const [confirmationData, setConfirmationData] = useState<{
    action: 'assign' | 'reset';
    type: 'mobile' | 'vehicle';
  } | null>(null);  const [selectedItem, setSelectedItem] = useState<{ value: number; label: string } | null>(null);
  const [isPermanent, setIsPermanent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [assignMobileBtn, setAssignMobileBtn] = useState("assign");
  const [assignVehicleBtn, setAssignVehicleBtn] = useState("assign");


  useEffect(() => {
    fetchEmployees();
  }, []);


  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    const response = await fetchEmployeeList();
    setEmployees(response);
    setLoading(false);

  };

  const showAssignConfirmation = () => {
    setConfirmationData({
      action: 'assign',
      type: showModal as 'mobile' | 'vehicle',
    });
  };

  const showResetConfirmation = (type: 'mobile' | 'vehicle') => {
    setConfirmationData({
      action: 'reset',
      type,
    });
  };

  const fetchOptions = async (type: 'mobile' | 'vehicle', query: string = '') => {
    try {
      let options = [];

      if (type === 'mobile') {
        const mobileItems = await fetchMobileOptions(query);
        options = mobileItems.map(item => ({
          value: item.idMobile,
          label: `${item.mobileUniCode} (${item.mobileNumber}) - ${item.status}`,
          isDisabled: item.status !== 'AVAILABLE',
        }));
        setMobileOptions(options);
      } else if (type === 'vehicle') {
        const vehicleItems = await fetchVehicleOptions(query);
        options = vehicleItems.map(item => ({
          value: item.idVehicle,
          label: `${item.registrationNo} (${item.brand} ${item.tradeDesignation}) - ${item.status}`,
          isDisabled: item.status !== 'AVAILABLE',
        }));
        setVehicleOptions(options);
      }

    } catch (error: any) {
      setError(`Error fetching ${type} options: ${error.message || 'Unknown error occurred.'}`);
    }
  };

  const fetchAssignDataHandler = async (employeeId: number) => {
    try {
      const response = await fetchAssignData(employeeId);

      if (response === null) {
        setAssignVehicleBtn("assign")
        setAssignMobileBtn("assign")
      }
      else {
        if (response.vehicle !== null && response.mobile !== null) {
          setAssignVehicleBtn("reset")
          setAssignMobileBtn("reset")
        }
        if (response.vehicle === null && response.mobile !== null) {
          setAssignVehicleBtn("assign")
          setAssignMobileBtn("reset")
        }
        if (response.vehicle !== null && response.mobile === null) {
          setAssignVehicleBtn("reset")
          setAssignMobileBtn("assign")
        }
      }
      setAssignData(response);

    } catch (err) {
      console.error('Error in fetchAssignDataHandler:', err);
      setError('Error fetching assigned data.');
    }
  };


  const handleEmployeeSelection = (
    selectedOption: SingleValue<{ value: number; label: string }>
  ) => {
    if (selectedOption) {
      const employee = employees.find(
        (emp) => emp.idEmployee === selectedOption.value
      );
      setSelectedEmployee(employee || null);
      setAssignData(null);

      if (employee) {
        fetchAssignDataHandler(employee.idEmployee);
      }
    } else {
      // Handle the case when the selection is cleared
      setSelectedEmployee(null);
      setAssignData(null);
    }
  };

  const handleAssign = async () => {
    if (!selectedItem || !selectedEmployee) return;
    setLoading(true);
    try {
      const assignType = showModal === 'mobile' ? 'mobile' : 'vehicle';

      const payload: AssignPayload = {
        employeeId: selectedEmployee.idEmployee,
        type: [assignType],
        mobileAssignRequest:
          showModal === 'mobile'
            ? {
              mobileId: selectedItem.value,
              isPermanentMobile: isPermanent,
            }
            : undefined,
        vehicleAssignRequest:
          showModal === 'vehicle'
            ? {
              vehicleId: selectedItem.value,
              isPermanentVehicle: isPermanent,
            }
            : undefined,
      };

      const response = await assignItem(payload);

      if (response.status === 201) {
        setSuccessMessage(`${assignType} assigned successfully!`);

        await updateStatus(assignType, selectedItem.value, 'UNAVAILABLE');

        setShowModal(null);
        setSelectedItem(null);
        setIsPermanent(false);
        // Fetch the latest assignment data for the selected employee
        await fetchAssignDataHandler(selectedEmployee.idEmployee);

        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(`Error assigning ${assignType}.`);
      }
    } catch (err) {
      setError('Error assigning item.');
    } finally {
      setLoading(false);
      setConfirmationData(null);
    }
  };

  const handleReset = async (resetType: string) => {
    setLoading(true);
    
    try {

      if (assignData !== null) {
        await fetchAssignDataHandler(assignData?.employee.idEmployee);

        if (resetType === "mobile") {
          const updateresult = updateStatus("mobile", assignData.mobile.idMobile, 'AVAILABLE');
          resetAssignmentData(assignData.idAssignment, 'mobile')
        }

        if (resetType === "vehicle") {
          const updateresult = updateStatus("vehicle", assignData.vehicle.idVehicle, 'AVAILABLE');
          resetAssignmentData(assignData.idAssignment, 'vehicle')
        }
        // Fetch the latest assignment data for the selected employee

        await fetchAssignDataHandler(assignData?.employee.idEmployee);
      }

    

    setSuccessMessage(`${resetType} reset successfully!`);

    } catch (err) {
      setError('Error resetting item.');
    } finally {
      setLoading(false);
      setConfirmationData (null);
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
          onChange={(selectedOption) => handleEmployeeSelection(selectedOption)}
          isClearable
          placeholder="Select an Employee"
          className="w-full"
        />
      </div>

      {error && <div className="bg-red-100 p-2 rounded-lg text-red-500">{error}</div>}
      {successMessage && <div className="bg-green-100 p-2 rounded-lg text-green-500">{successMessage}</div>}

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

          <div className="mt-6 flex space-x-4">

            {assignMobileBtn === "assign" ?
              <button
                onClick={() => {
                  setShowModal('mobile');
                  fetchOptions('mobile');
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Assign Mobile
              </button> :
              <button
                onClick={() => {
                  handleReset('mobile');
                  // setShowModal('mobile');
                  // fetchOptions('mobile');
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Reset Mobile
              </button>
            }

            {assignVehicleBtn === "assign" ?
              <button
                onClick={() => {
                  setShowModal('vehicle');
                  fetchOptions('vehicle');
                }}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Assign Vehicle
              </button> : <button
                onClick={() => {
                  handleReset('vehicle');
                  // setShowModal('vehicle');
                  // fetchOptions('vehicle');
                }}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Reset Vehicle
              </button>

            }


          </div>

          {assignData && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700">Current Assignments</h3>
              <div className="grid grid-cols-2 gap-4">
                {assignData.mobile && (
                  <div className="bg-white border p-4 rounded-lg">
                    <h4 className="font-semibold">Mobile</h4>
                    <p>{assignData.mobile.mobileModel}</p>
                    <p>Status: {assignData.mobile.status}</p>
                  </div>
                )}
                {assignData.vehicle && (
                  <div className="bg-white border p-4 rounded-lg">
                    <h4 className="font-semibold">Vehicle</h4>
                    <p>{assignData.vehicle.registrationNo}</p>
                    <p>Status: {assignData.vehicle.status}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for assigning item */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {assignData && (showModal === 'mobile' && assignData.mobile || showModal === 'vehicle' && assignData.vehicle)
                ? 'Reset Assignment'
                : `Assign ${showModal === 'mobile' ? 'Mobile' : 'Vehicle'}`}
            </h2>
            <Select
              options={showModal === 'mobile' ? mobileOptions : vehicleOptions}
              onChange={(selectedOption) => setSelectedItem(selectedOption)}
              isClearable
              placeholder={`Select a ${showModal}`}
            />
            <div className="mt-4 flex justify-between">
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isPermanent}
                    onChange={() => setIsPermanent(!isPermanent)}
                  />
                  <span className="ml-2">Permanent</span>
                </label>
              </div>
              <button
                onClick={handleAssign}
                disabled={!selectedItem}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${!selectedItem ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Assign
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmationData && (
        <div className="modal">
          <p>Are you sure you want to {confirmationData.action} this {confirmationData.type}?</p>
          <button onClick={confirmationData.action === 'assign' ? handleAssign : () => handleReset(confirmationData.type)}>Confirm</button>
          <button onClick={() => setConfirmationData(null)}>Cancel</button>
        </div>
      )}
    </div>
    
  );
};

export default EmployeeSearch;

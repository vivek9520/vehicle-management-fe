"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

interface EmployeeFormData {
  uniqueId: string;
  employeeName: string;
  status: "Active" | "Inactive";
}

interface FormErrors {
  uniqueId?: string;
  employeeName?: string;
}

export default function CreateEmployee() {
  const initialFormData: EmployeeFormData = {
    uniqueId: "",
    employeeName: "",
    status: "Active",
  };

  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "">("");
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const errors: FormErrors = { ...formErrors };
    if (name === "uniqueId") {
      errors.uniqueId = value.trim() === "" ? "Unique ID is required" : undefined;
    } else if (name === "employeeName") {
      errors.employeeName = value.trim() === "" ? "Employee name is required" : undefined;
    }
    setFormErrors(errors);
  };

  const isFormValid = (): boolean => {
    return (
      Object.values(formErrors).every((error) => error === undefined) &&
      Object.values(formData).every((field) => field !== "")
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:8080/api/v1/employee/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setTimeout(() => {
        setIsLoading(false);
        if (response.ok) {
          setPopupMessage("Employee created successfully!");
          setPopupType("success");
          setShowPopup(true);
          setFormData(initialFormData);
        } else {
          setPopupMessage("There was an error creating the employee. Please try again.");
          setPopupType("error");
          setShowPopup(true);
        }
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        setPopupMessage("There was an error creating the employee. Please try again.");
        setPopupType("error");
        setShowPopup(true);
      }, 1500);
    }
  };

  return (
    <div>
      {/* Full-Screen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner-border text-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <main>
        <div>
          <h1 className="text-3xl font-semibold text-gray-400 mb-6">Create Employee</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="uniqueId" className="block font-medium text-[#001A6E]">
                Unique ID
              </label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleInputChange}
                placeholder="Enter employee unique ID"
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {formErrors.uniqueId && (
                <p className="text-red-500 text-sm">{formErrors.uniqueId}</p>
              )}
            </div>

            <div>
              <label htmlFor="employeeName" className="block font-medium text-[#001A6E]">
                Employee Name
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                placeholder="Enter employee name"
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {formErrors.employeeName && (
                <p className="text-red-500 text-sm">{formErrors.employeeName}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block font-medium text-[#001A6E]">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-span-full flex justify-center mt-6">
              <button
                type="submit"
                className={`p-3 bg-blue-600 text-white rounded-lg shadow-md font-bold transition duration-300 ${isLoading || !isFormValid() ? "cursor-not-allowed opacity-70" : "hover:bg-blue-700"
                  }`}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 popup-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className={`text-lg font-bold ${popupType === "success" ? "text-green-500" : "text-red-500"}`}>
              {popupType === "success" ? "Success" : "Error"}
            </h3>
            <p className="mt-2 text-gray-600">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { Company, Office, Vehicle } from "@/app/models/types";

export default function CreateVehicle() {

  const initialFormData = {
    idVehicle: "", 
    dateOfFirstCommissioning: "",
    acquisitionDate: "",
    registrationNo: "",
    vehicleCategory: "",
    brand: "",
    tradeDesignation: "",
    eidentificationNumber: "",  // Corrected field name
    color: "",
    emissionClass: "",
    co2Level: "",
    fuel: "",
    insuranceCompany: "",
    rearTireDimension: "",
    idOffice: "",
    idCompany: "",
    dateOfControlCurrent: "",
    dateOfControlNext: ""
  };
  // State for form fields
  const [formData, setFormData] = useState<Vehicle>(initialFormData);

  // State for handling spinner and popup
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // success or error
  const [showPopup, setShowPopup] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([])
  const [offices, setOffices] = useState<Office[]>([]);


  useEffect(() => {
    fetchCompanyData();
  }, []);


  async function fetchCompanyData() {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage (or wherever it's stored)
  
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:8080/api/v1/company/all', {
        method: 'GET',  // 'GET' method for retrieving data
        headers: {
          'Authorization': `Bearer ${token}`,  // Authorization header with the Bearer token
          'Content-Type': 'application/json',  // Optional: to specify that you expect JSON
        },
      });
  
      // Check if the response status is OK (200)
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
  
      // Parse the JSON response
      const data = await res.json();
      setCompanies(data.data)
      console.log(data);  // Log the fetched data
  
      // You can then use the data (e.g., set it in your state or display in a dropdown)
    } catch (error) {
      console.error('Error fetching data:', error);  // Handle any errors that occurred
    }
  }

  // Handle input changes
  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      setTimeout(() => {
        setIsLoading(false); // Hide spinner after 1.5 seconds
        if (response.ok) {
          setPopupMessage("Vehicle created successfully!");
          setPopupType("success");
          setShowPopup(true);
          setFormData(initialFormData);
        } else {
          setPopupMessage("There was an error creating the vehicle. Please try again.");
          setPopupType("error");
          setShowPopup(true);
        }
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false); // Hide spinner after 1.5 seconds
        setPopupMessage("There was an error creating the vehicle. Please try again.");
        setPopupType("error");
        setShowPopup(true);
      }, 1500);
    }
  };


  // Handle company selection
  const handleCompanyChange = (e: { target: { value: any; }; }) => {
    const selectedCompanyId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      idCompany: selectedCompanyId,
      idOffice: '' // Reset office when company changes
    }));

    // Find the selected company and update the office list
    const selectedCompany = companies.find(
      (company) => company.idCompany === parseInt(selectedCompanyId)
    );
    if (selectedCompany) {
      setOffices(selectedCompany.offices);
    }
  };

  // Handle office selection
  const handleOfficeChange = (e: { target: { value: any; }; }) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      idOffice: value,
    }));
  };

  return (
<div>
  <main >
    <div >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-400">Create Vehicle</h1>
        
      </div>

      {/* Form Fields - 4x4 Grid Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Date of First Commissioning */}
        <div>
          <label htmlFor="dateOfFirstCommissioning" className="block font-medium text-[#001A6E]">
            Date of First Commissioning
          </label>
          <input
            type="date"
            id="dateOfFirstCommissioning"
            name="dateOfFirstCommissioning"
            value={formData.dateOfFirstCommissioning}
            onChange={handleInputChange}
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Acquisition Date */}
        <div>
          <label htmlFor="acquisitionDate" className="block font-medium text-[#001A6E]">
            Acquisition Date
          </label>
          <input
            type="date"
            id="acquisitionDate"
            name="acquisitionDate"
            value={formData.acquisitionDate}
            onChange={handleInputChange}
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Registration Number */}
        <div>
          <label htmlFor="registrationNo" className="block font-medium text-[#001A6E]">
            Registration Number
          </label>
          <input
            type="text"
            id="registrationNo"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleInputChange}
            placeholder="Enter registration number"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Vehicle Category */}
        <div>
          <label htmlFor="vehicleCategory" className="block font-medium text-[#001A6E]">
            Vehicle Category
          </label>
          <input
            type="text"
            id="vehicleCategory"
            name="vehicleCategory"
            value={formData.vehicleCategory}
            onChange={handleInputChange}
            placeholder="Enter vehicle category"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block font-medium text-[#001A6E]">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Enter brand"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Control Current Date */}
        <div>
          <label htmlFor="dateOfControlCurrent" className="block font-medium text-[#001A6E]">
            Control Current Date
          </label>
          <input
            type="date"
            id="dateOfControlCurrent"
            name="dateOfControlCurrent"
            value={formData.dateOfControlCurrent}
            onChange={handleInputChange}
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Control Next Date */}
        <div>
          <label htmlFor="dateOfControlNext" className="block font-medium text-[#001A6E]">
            Control Next Date
          </label>
          <input
            type="date"
            id="dateOfControlNext"
            name="dateOfControlNext"
            value={formData.dateOfControlNext}
            onChange={handleInputChange}
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Trade Designation */}
        <div>
          <label htmlFor="tradeDesignation" className="block font-medium text-[#001A6E]">
            Trade Designation
          </label>
          <input
            type="text"
            id="tradeDesignation"
            name="tradeDesignation"
            value={formData.tradeDesignation}
            onChange={handleInputChange}
            placeholder="Enter trade designation"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* E-Identification Number */}
        <div>
          <label htmlFor="eIdentificationNumber" className="block font-medium text-[#001A6E]">
            E-Identification Number
          </label>
          <input
            type="text"
            id="eidentificationNumber"
            name="eidentificationNumber"
            value={formData.eidentificationNumber}
            onChange={handleInputChange}
            placeholder="Enter E-ID number"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Company Dropdown */}
        <div>
          <label htmlFor="company" className="block font-medium text-[#001A6E]">
            Company
          </label>
          <select
            id="company"
            name="company"
            onChange={handleCompanyChange}
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.idCompany} value={company.idCompany}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Office Dropdown (Conditional on Company Selection) */}
        {formData.idCompany && (
          <div>
            <label htmlFor="office" className="block font-medium text-[#001A6E]">
              Office
            </label>
            <select
              id="office"
              name="office"
              value={formData.idOffice}
              onChange={handleOfficeChange}
              required
              className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
            >
              <option value="">Select Office</option>
              {offices.map((office) => (
                <option key={office.idOffice} value={office.idOffice}>
                  {office.officeName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Color */}
        <div>
          <label htmlFor="color" className="block font-medium text-[#001A6E]">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Enter color"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Emission Class */}
        <div>
          <label htmlFor="emissionClass" className="block font-medium text-[#001A6E]">
            Emission Class
          </label>
          <input
            type="text"
            id="emissionClass"
            name="emissionClass"
            value={formData.emissionClass}
            onChange={handleInputChange}
            placeholder="Enter emission class"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* CO2 Level */}
        <div>
          <label htmlFor="co2Level" className="block font-medium text-[#001A6E]">
            CO2 Level
          </label>
          <input
            type="number"
            step="0.01"
            id="co2Level"
            name="co2Level"
            value={formData.co2Level}
            onChange={handleInputChange}
            placeholder="Enter CO2 level"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Fuel */}
        <div>
          <label htmlFor="fuel" className="block font-medium text-[#001A6E]">
            Fuel / Bränsle
          </label>
          <select
            id="fuel"
            name="fuel"
            value={formData.fuel}
            onChange={handleInputChange}
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          >
            <option value="">Select fuel</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Rear Tire Dimension */}
        <div>
          <label htmlFor="rearTireDimension" className="block font-medium text-[#001A6E]">
            Rear Tire Dimension
          </label>
          <input
            type="text"
            id="rearTireDimension"
            name="rearTireDimension"
            value={formData.rearTireDimension}
            onChange={handleInputChange}
            placeholder="Enter rear tire dimension"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        {/* Insurance Company */}
        <div>
          <label htmlFor="insuranceCompany" className="block font-medium text-[#001A6E]">
            Insurance Company
          </label>
          <input
            type="text"
            id="insuranceCompany"
            name="insuranceCompany"
            value={formData.insuranceCompany}
            onChange={handleInputChange}
            placeholder="Enter insurance company"
            required
            className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
          />
        </div>

        <div className="col-span-full flex justify-center mt-0">
        <button
            type="submit"
            className="px-6 py-2 border-2 border-[#0A3981] text-[#0A3981] rounded-md hover:bg-[#D4EBF8] hover:text-[#0A3981] transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? <span className="animate-spin">Loading...</span> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  </main>
</div>

  );
}















"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { Company, Office, Vehicle } from "@/app/models/types";

export default function CreateVehicle() {

  const initialFormData ={
    dateOfFirstCommissioning: "",
    acquisitionDate: "",
    registrationNo: "",
    vehicleCategory: "",
    brand: "",
    tradeDesignation: "",
    eIdentificationNumber: "",
    color: "",
    emissionClass: "",
    co2Level: "",
    fuel: "",
    insuranceCompany: "",
    rearTireDimension: "",
    idOffice:"",
    idCompany:"",
    dateOfControlCurrent:"",
    dateOfControlNext:""
  }
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
    <div className="min-h-screen flex flex-col bg-[#F9F6F1]">
      <main className="flex-grow flex justify-center items-start py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-7xl grid gap-6">
          <h2 className="text-3xl font-bold text-[#001A6E] text-center mb-6">
            Create Vehicle / Skapa Fordon
          </h2>

          {/* Form Fields - 3x3 Grid Layout */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="dateOfFirstCommissioning" className="block font-medium text-[#001A6E]">
                Date of First Commissioning / Datum för första användning
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

            <div>
              <label htmlFor="acquisitionDate" className="block font-medium text-[#001A6E]">
                Acquisition Date / Förvärvsdatum
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

            <div>
              <label htmlFor="registrationNo" className="block font-medium text-[#001A6E]">
                Registration Number / Registreringsnummer
              </label>
              <input
                type="text"
                id="registrationNo"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                placeholder="Enter registration number / Ange registreringsnummer"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="vehicleCategory" className="block font-medium text-[#001A6E]">
                Vehicle Category / Fordonskategori
              </label>
              <input
                type="text"
                id="vehicleCategory"
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleInputChange}
                placeholder="Enter vehicle category / Ange fordonskategori"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block font-medium text-[#001A6E]">
                Brand / Märke
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand / Ange märke"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            
            <div>
              <label htmlFor="dateOfControlCurrent" className="block font-medium text-[#001A6E]">
              Control Current Date / Förvärvsdatum
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

            
            <div>
              <label htmlFor="dateOfControlNext" className="block font-medium text-[#001A6E]">
             Control Next Date / Förvärvsdatum
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

            <div>
              <label htmlFor="tradeDesignation" className="block font-medium text-[#001A6E]">
                Trade Designation / Yrkesbenämning
              </label>
              <input
                type="text"
                id="tradeDesignation"
                name="tradeDesignation"
                value={formData.tradeDesignation}
                onChange={handleInputChange}
                placeholder="Enter trade designation / Ange yrkesbenämning"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="eIdentificationNumber" className="block font-medium text-[#001A6E]">
                E-Identification Number / E-ID Nummer
              </label>
              <input
                type="text"
                id="eIdentificationNumber"
                name="eIdentificationNumber"
                value={formData.eIdentificationNumber}
                onChange={handleInputChange}
                placeholder="Enter E-ID number / Ange E-ID nummer"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>
            <div>
      {/* Company Dropdown */}
      <label htmlFor="company" className="block font-medium text-[#001A6E]">
        Company / Företag
      </label>
      <select
        id="company"
        name="company"
      
        onChange={handleCompanyChange}
        required
        className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
      >
        <option value="">Select Company</option>
        {/* Dynamically generate options from the companies list */}
        {companies.map((company) => (
          <option key={company.idCompany} value={company.idCompany}>
            {company.companyName}  {/* Display the company name */}
          </option>
        ))}
      </select>

      {/* Office Dropdown (conditional on company selection) */}
      {formData.idCompany && (
        <div>
          <label htmlFor="office" className="block font-medium text-[#001A6E]">
            Office / Kontor
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
            {/* Dynamically generate office options based on selected company */}
            {offices.map((office) => (
              <option key={office.idOffice} value={office.idOffice}>
                {office.officeName}  {/* Display the office name */}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>

            <div>
              <label htmlFor="color" className="block font-medium text-[#001A6E]">
                Color / Färg
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Enter color / Ange färg"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="emissionClass" className="block font-medium text-[#001A6E]">
                Emission Class / Utsläppsklass
              </label>
              <input
                type="text"
                id="emissionClass"
                name="emissionClass"
                value={formData.emissionClass}
                onChange={handleInputChange}
                placeholder="Enter emission class / Ange utsläppsklass"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="co2Level" className="block font-medium text-[#001A6E]">
                CO2 Level / CO2 Nivå
              </label>
              <input
                type="number"
                step="0.01"
                id="co2Level"
                name="co2Level"
                value={formData.co2Level}
                onChange={handleInputChange}
                placeholder="Enter CO2 level / Ange CO2 nivå"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

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
                <option value="">Select fuel / Välj bränsle</option>
                <option value="petrol">Petrol / Bensin</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric / El</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="rearTireDimension" className="block font-medium text-[#001A6E]">
                Rear Tire Dimension / Bakdäcksdimension
              </label>
              <input
                type="text"
                id="rearTireDimension"
                name="rearTireDimension"
                value={formData.rearTireDimension}
                onChange={handleInputChange}
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
                placeholder="Enter rear tire dimension (e.g., 205/55R16)"
              />
            </div>

            <div>
              <label htmlFor="insuranceCompany" className="block font-medium text-[#001A6E]">
                Insurance Company / Försäkringsbolag
              </label>
              <input
                type="text"
                id="insuranceCompany"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleInputChange}
                placeholder="Enter insurance company / Ange försäkringsbolag"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div className="col-span-full flex justify-center mt-6">
              <button
                type="submit"
                className={`flex items-center justify-center bg-[#001A6E] text-white py-3 px-6 rounded-md font-bold transition duration-300 ${isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-[#D997A5]"}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin">Loading...</span>
                ) : (
                  "Submit / Skicka"
                )}
              </button>
            </div>
          </form>

        </div>
      </main>
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3
              className={`text-lg font-bold ${popupType === "success" ? "text-green-500" : "text-red-500"
                }`}
            >
              {popupType === "success" ? "Success" : "Error"}
            </h3>
            <p className="mt-2 text-gray-600">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-[#EFB6C8] text-white py-2 px-4 rounded-md hover:bg-[#FFD2A0] transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}















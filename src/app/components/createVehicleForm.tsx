"use client";


import React, { useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function CreateVehicle() {
  // State for form fields
  const [formData, setFormData] = useState({
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
    insuranceCompany: ""
  });

  // Handle input changes
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

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

      if (!response.ok) {
        throw new Error("Failed to create vehicle");
      }

      // Handle successful response
      alert("Vehicle created successfully!");
    } catch (error) {
      // Handle error
      console.error("Error creating vehicle:", error);
      alert("There was an error creating the vehicle. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F1]">
      <Header />
      <main className="flex-grow flex justify-center items-start py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-7xl grid gap-6">
          <h2 className="text-3xl font-bold text-[#8174A0] text-center mb-6">
            Create Vehicle / Skapa Fordon
          </h2>

          {/* Form Fields - 3x3 Grid Layout */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="dateOfFirstCommissioning" className="block font-medium text-[#8174A0]">
                Date of First Commissioning / Datum för första användning
              </label>
              <input
                type="date"
                id="dateOfFirstCommissioning"
                name="dateOfFirstCommissioning"
                value={formData.dateOfFirstCommissioning}
                onChange={handleInputChange}
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="acquisitionDate" className="block font-medium text-[#8174A0]">
                Acquisition Date / Förvärvsdatum
              </label>
              <input
                type="date"
                id="acquisitionDate"
                name="acquisitionDate"
                value={formData.acquisitionDate}
                onChange={handleInputChange}
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="registrationNo" className="block font-medium text-[#8174A0]">
                Registration Number / Registreringsnummer
              </label>
              <input
                type="text"
                id="registrationNo"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleInputChange}
                placeholder="Enter registration number / Ange registreringsnummer"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="vehicleCategory" className="block font-medium text-[#8174A0]">
                Vehicle Category / Fordonskategori
              </label>
              <input
                type="text"
                id="vehicleCategory"
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleInputChange}
                placeholder="Enter vehicle category / Ange fordonskategori"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block font-medium text-[#8174A0]">
                Brand / Märke
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand / Ange märke"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="tradeDesignation" className="block font-medium text-[#8174A0]">
                Trade Designation / Yrkesbenämning
              </label>
              <input
                type="text"
                id="tradeDesignation"
                name="tradeDesignation"
                value={formData.tradeDesignation}
                onChange={handleInputChange}
                placeholder="Enter trade designation / Ange yrkesbenämning"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="eIdentificationNumber" className="block font-medium text-[#8174A0]">
                E-Identification Number / E-ID Nummer
              </label>
              <input
                type="text"
                id="eIdentificationNumber"
                name="eIdentificationNumber"
                value={formData.eIdentificationNumber}
                onChange={handleInputChange}
                placeholder="Enter E-ID number / Ange E-ID nummer"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="color" className="block font-medium text-[#8174A0]">
                Color / Färg
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Enter color / Ange färg"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="emissionClass" className="block font-medium text-[#8174A0]">
                Emission Class / Utsläppsklass
              </label>
              <input
                type="text"
                id="emissionClass"
                name="emissionClass"
                value={formData.emissionClass}
                onChange={handleInputChange}
                placeholder="Enter emission class / Ange utsläppsklass"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="co2Level" className="block font-medium text-[#8174A0]">
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
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="fuel" className="block font-medium text-[#8174A0]">
                Fuel / Bränsle
              </label>
              <select
                id="fuel"
                name="fuel"
                value={formData.fuel}
                onChange={handleInputChange}
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
              <label htmlFor="insuranceCompany" className="block font-medium text-[#8174A0]">
                Insurance Company / Försäkringsbolag
              </label>
              <input
                type="text"
                id="insuranceCompany"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleInputChange}
                placeholder="Enter insurance company / Ange försäkringsbolag"
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div className="col-span-full flex justify-center mt-6">
              <button
                type="submit"
                className="bg-[#EFB6C8] text-white py-3 rounded-md hover:bg-[#FFD2A0] transition duration-300"
              >
                Submit / Skicka
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

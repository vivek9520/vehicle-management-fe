"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function CreateMobile() {
  const initialFormData = {
    mobileUniCode: "",
    mobileModel: "",
    idOffice: "",
    status: "Active",
    mobileNumber: "",
    subscriptionId: 1, // Default subscriptionId to 1 or any other value you prefer
  };

  // State for form fields
  const [formData, setFormData] = useState(initialFormData);

  // State for handling spinner and popup
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // success or error
  const [showPopup, setShowPopup] = useState(false);
  const [mobileSubscription, setMobileSubscription] = useState([]);

  useEffect(() => {
    getMobileSubscription();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/mobile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setTimeout(() => {
        setIsLoading(false); // Hide spinner after 1.5 seconds
        if (response.ok) {
          setPopupMessage("Mobile created successfully!");
          setPopupType("success");
          setShowPopup(true);
          setFormData(initialFormData);
        } else {
          setPopupMessage("There was an error creating the mobile. Please try again.");
          setPopupType("error");
          setShowPopup(true);
        }
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false); // Hide spinner after 1.5 seconds
        setPopupMessage("There was an error creating the mobile. Please try again.");
        setPopupType("error");
        setShowPopup(true);
      }, 1500);
    }
  };

  const getMobileSubscription = async () => {
    setIsLoading(true); // Show spinner
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/subscription/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false); // Hide spinner after 1.5 seconds
      if (response.ok) {
        const data = await response.json(); // Extract the response data
        setMobileSubscription(data.data);
      } else {
        setPopupMessage("Failed to load subscriptions.");
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error) {
      setIsLoading(false);
      setPopupMessage("There was an error fetching subscriptions.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div>
      <main>
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-400">Create Mobile</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="mobileUniCode" className="block font-medium text-[#001A6E]">
                Mobile UniCode
              </label>
              <input
                type="text"
                id="mobileUniCode"
                name="mobileUniCode"
                value={formData.mobileUniCode}
                onChange={handleInputChange}
                placeholder="Enter mobile unique code"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="mobileModel" className="block font-medium text-[#001A6E]">
                Mobile Model
              </label>
              <input
                type="text"
                id="mobileModel"
                name="mobileModel"
                value={formData.mobileModel}
                onChange={handleInputChange}
                placeholder="Enter mobile model"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
              <label htmlFor="idOffice" className="block font-medium text-[#001A6E]">
                Office ID
              </label>
              <input
                type="number"
                id="idOffice"
                name="idOffice"
                value={formData.idOffice}
                onChange={handleInputChange}
                placeholder="Enter office ID"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
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
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block font-medium text-[#001A6E]">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                required
                className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
              />
            </div>

            <div>
  <label htmlFor="subscriptionId" className="block font-medium text-[#001A6E]">
    Subscription ID
  </label>
  <select
    id="subscriptionId"
    name="subscriptionId"
    value={formData.subscriptionId}
    onChange={handleInputChange}
    required
    className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm focus:border-[#EFB6C8] focus:ring-[#EFB6C8]"
  >
    <option value="">Select a subscription</option>
    {mobileSubscription.map((subscription) => (
      <option key={subscription.idMobileSubscription} value={subscription.idMobileSubscription}>
        {subscription.subscriptionName} - {subscription.fee} SEK
      </option>
    ))}
  </select>
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
                  "Submit"
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
            <h3 className={`text-lg font-bold ${popupType === "success" ? "text-green-500" : "text-red-500"}`}>
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

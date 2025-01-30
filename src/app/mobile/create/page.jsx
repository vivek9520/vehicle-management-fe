"use client";

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CreateMobile() {
  const initialFormData = {
    mobileUniCode: "",
    mobileModel: "",
    idOffice: "",
    status: "AVAIBLE",
    mobileNumber: "",
    subscriptionId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mobileSubscription, setMobileSubscription] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    getMobileSubscription();
    getCompanyOffices();
  }, []);

  const getCompanyOffices = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/company/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data);
      } else {
        setPopupMessage("Failed to load company information.");
        setPopupType("error");
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage("There was an error fetching company information.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };
    switch (name) {
      case "mobileUniCode":
        errors.mobileUniCode = value.trim() === "" ? "Mobile UniCode is required" : "";
        break;
      case "mobileModel":
        errors.mobileModel = value.trim() === "" ? "Mobile Model is required" : "";
        break;
      case "idOffice":
        errors.idOffice = value.trim() === "" ? "Office ID is required" : "";
        break;
      case "mobileNumber":
        errors.mobileNumber = value.trim() === "" ? "Mobile Number is required" : "";
        break;
      case "subscriptionId":
        errors.subscriptionId = value === "" ? "Please select a subscription" : "";
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const isFormValid = () => {
    return (
      Object.values(formErrors).every((error) => error === "") &&
      Object.values(formData).every((field) => field !== "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsLoading(true);

    const token = localStorage.getItem("authToken");

    // Structure the data to match the required format
    const submitData = {
      mobileUniCode: formData.mobileUniCode,
      mobileModel: formData.mobileModel,
      idOffice: parseInt(formData.idOffice), // Ensure it's an integer
      status: formData.status,
      mobileNumber: formData.mobileNumber,
      subscriptionId: parseInt(formData.subscriptionId), // Ensure it's an integer
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/mobile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      setTimeout(() => {
        setIsLoading(false);
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
        setIsLoading(false);
        setPopupMessage("There was an error creating the mobile. Please try again.");
        setPopupType("error");
        setShowPopup(true);
      }, 1500);
    }
  };

  const getMobileSubscription = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/api/v1/subscription/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoading(false);
      if (response.ok) {
        const data = await response.json();
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
          <h1 className="text-3xl font-semibold text-gray-400 mb-6">Create Mobile</h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
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
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {formErrors.mobileUniCode && (
                <p className="text-red-500 text-sm">{formErrors.mobileUniCode}</p>
              )}
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
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {formErrors.mobileModel && (
                <p className="text-red-500 text-sm">{formErrors.mobileModel}</p>
              )}
            </div>

            <div>
              <label htmlFor="idOffice" className="block font-medium text-[#001A6E]">
                Office
              </label>
              <select
                id="idOffice"
                name="idOffice"
                value={formData.idOffice}
                onChange={handleInputChange}
                required
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select an office</option>
                {companies.map((company) =>
                  company.offices.map((office) => (
                    <option key={office.idOffice} value={office.idOffice}>
                      {company.companyName} - {office.officeName}
                    </option>
                  ))
                )}
              </select>
              {formErrors.idOffice && (
                <p className="text-red-500 text-sm">{formErrors.idOffice}</p>
              )}
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block font-medium text-[#001A6E]">
                Mobile Number
              </label>
              <div className="flex items-center space-x-2">
                <span className="p-3 bg-gray-100 border rounded-lg shadow-md text-gray-600 select-none">
                  +46
                </span>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your number"
                  className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              {formErrors.mobileNumber && (
                <p className="text-red-500 text-sm">{formErrors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="subscriptionId" className="block font-medium text-[#001A6E]">
                Subscription Plan
              </label>
              <select
                id="subscriptionId"
                name="subscriptionId"
                value={formData.subscriptionId}
                onChange={handleInputChange}
                required
                className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select a subscription</option>
                {mobileSubscription.map((subscription) => (
                  <option
                    key={subscription.idMobileSubscription}
                    value={subscription.idMobileSubscription}
                  >
                    {subscription.subscriptionName} - {subscription.fee} SEK
                  </option>
                ))}
              </select>
              {formErrors.subscriptionId && (
                <p className="text-red-500 text-sm">{formErrors.subscriptionId}</p>
              )}
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

"use client";
import axios from 'axios';
// pages/service-form.js
import { useState } from 'react';
import {useParams} from 'next/navigation'

export default function ServiceForm() {
  
    const {id} = useParams()
    const initialFormData = {
        serviceType: '',
        serviceDate: '',
        description: '',
        idVehicle: id
    };
    const [formData, setFormData] = useState(initialFormData);

    const [isLoading, setIsLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState(""); // success or error
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        console.log('Form submitted:', formData);
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token is missing');
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        try {
            const result = await axios.post('http://localhost:8080/api/v1/service_activity', formData, { headers })
            if (result.status == 201) {
                setTimeout(() => {
                    setIsLoading(false); // Hide spinner after 1.5 seconds
                    setPopupMessage("There was an error creating the Service. Please try again.");
                    setPopupType("success");
                    setShowPopup(true);
                }, 1500);

                setFormData(initialFormData)
            }

        } catch (error) {
            setTimeout(() => {
                setIsLoading(false); // Hide spinner after 1.5 seconds
                setPopupMessage("There was an error creating the Service. Please try again.");
                setPopupType("error");
                setShowPopup(true);
            }, 1500);
        }



    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
            <main className="flex-grow flex items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-6"
                >
                    <h1 className="text-2xl font-semibold text-[#001A6E] text-center">
                        Service Form
                    </h1>

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="serviceType"
                                className="block text-[#001A6E] font-medium mb-1"
                            >
                                Service Type
                            </label>
                            <input
                                type="text"
                                id="serviceType"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                placeholder="Enter service type"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#001A6E] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="serviceDate"
                                className="block text-[#001A6E] font-medium mb-1"
                            >
                                Service Date
                            </label>
                            <input
                                type="date"
                                id="serviceDate"
                                name="serviceDate"
                                value={formData.serviceDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#001A6E] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-[#001A6E] font-medium mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#001A6E] focus:outline-none"
                            ></textarea>
                        </div>

                        <div>
                            <label
                                htmlFor="idVehicle"
                                className="block text-[#001A6E] font-medium mb-1"
                            >
                                Vehicle ID
                            </label>
                            <input
                                type="number"
                                id="idVehicle"
                                name="idVehicle"
                                value={formData.idVehicle}
                                onChange={handleChange}
                                placeholder="Enter vehicle ID"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#001A6E] focus:outline-none"
                            disabled/>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center bg-[#001A6E] text-white py-3 rounded-md font-bold transition duration-300 ${isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-[#D997A5]"
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="animate-spin">Loading...</span>
                        ) : (
                            "Submit / Skicka"
                        )}
                    </button>
                </form>
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

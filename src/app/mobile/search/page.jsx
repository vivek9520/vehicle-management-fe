"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function SearchMobile() {
  const initialFormData = {
    mobileUniCode: "",
  };

  const initialActivityData = {
    activity: "",
    person: "",
    description: "",
    activityStatus: "",
    idMobile: '',
  };

  // State for form fields
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileData, setMobileData] = useState(null); // Initially no data
  const [activities, setActivities] = useState([]); // Initially no activities
  const [newActivity, setNewActivity] = useState(initialActivityData);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);

  // Fetch mobile activities when mobile data is loaded
  useEffect(() => {
    if (mobileData && mobileData.idMobile) {
      fetchActivities(mobileData.idMobile);
    }
  }, [mobileData]);

  const fetchActivities = async (idMobile) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/v1/mobile/activity/by-mobile/${idMobile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivities(response.data.content);
    } catch (err) {
      setError("Failed to fetch activities.");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication token is missing.");
      setIsLoading(false); // Hide spinner on error
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/mobile/get-by-code?uniCode=${formData.mobileUniCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response.data;
      setMobileData(data);
      setStatus(data.status); // Update the status from the response
    } catch (err) {
      setMobileData("");
      setStatus("");
      setActivities("");
      setError("Failed to fetch mobile details.");
    } finally {
      setIsLoading(false);
    }
  };



  // Handle adding a new activity
  const handleAddActivity = async (e) => {
    // e.preventDefault();


    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      // Call the save activity API
      await axios.post(
        "http://localhost:8080/api/v1/mobile/activity/save",
        newActivity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

       // Update the status to completed
       await axios.put(
        `http://localhost:8080/api/v1/mobile/${mobileData.idMobile}/status?status=OUT`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setActivities([...activities, newActivity]);
      setNewActivity(initialActivityData);
      setShowNewActivityForm(false); // Hide the new activity form after submission
    } catch (err) {
      setError("Failed to add new activity.");
    }
  };

  // Handle 'Hand Over' button click
  const handleHandOver = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      // Update the status to completed
      await axios.put(
        `http://localhost:8080/api/v1/mobile/${mobileData.idMobile}/status?status=IN`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add a new activity for Hand Over
      const newActivityData = {
        activity: "Vehicle Inspection",
        person: "John Doe",
        description: "Conducted a routine inspection of the vehicle's engine and brakes.",
        activityStatus: "IN",
        idMobile: mobileData.idMobile,
      };

      await axios.post(
        "http://localhost:8080/api/v1/mobile/activity/save",
        newActivityData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowNewActivityForm(false); // Hide the form after the handover
    } catch (err) {
      setError("Failed to hand over mobile.");
    }
  };

  // Handle "New Assign" button click
  const handleNewAssign = () => {
    setShowNewActivityForm(true);
    const newActivityData = {
      activity: "Phone Hand Over to Employee",
      person: "",
      description: "",
      activityStatus: "OUT",
      idMobile: mobileData.idMobile,
    };
    setNewActivity(newActivityData)
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F1]">
      <main className="flex-grow flex justify-center items-start py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-7xl grid gap-6">
          <h2 className="text-3xl font-bold text-[#001A6E] text-center mb-6">
            Search Mobile by UniCode
          </h2>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

            <div className="col-span-full flex justify-center mt-6">
              <button
                type="submit"
                className={`flex items-center justify-center bg-[#001A6E] text-white py-3 px-6 rounded-md font-bold transition duration-300 ${isLoading ? "cursor-not-allowed opacity-70" : "hover:bg-[#074799]"}`}
                disabled={isLoading}
              >
                {isLoading ? <span className="animate-spin">Loading...</span> : "Search"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-500 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {/* Mobile Data Display */}
          {mobileData && (
            <div className="mt-6 p-6 border border-[#A888B5] rounded-lg shadow-lg bg-white">
              <h3 className="text-2xl font-bold text-[#001A6E] mb-6 text-center">Mobile Details</h3>

              <div className="grid grid-cols-2 gap-6 text-gray-700">
                <div>
                  <p className="font-medium"><strong>UniCode:</strong> {mobileData.mobileUniCode}</p>
                </div>
                <div>
                  <p className="font-medium"><strong>Model:</strong> {mobileData.mobileModel}</p>
                </div>
                <div>
                  <p className="font-medium"><strong>Office ID:</strong> {mobileData.idOffice}</p>
                </div>
                <div>
                  <p className="font-medium"><strong>Status:</strong> {mobileData.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium"><strong>Remark:</strong> {mobileData.remark}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                {status === "IN" && (
                  <button
                    className="bg-[#001A6E] text-white py-2 px-6 rounded-lg shadow-md hover:bg-[#074799] focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-300"
                    onClick={handleNewAssign}
                  >
                    New Assign
                  </button>
                )}
                {status === "OUT" && (
                  <button
                    className="bg-[#001A6E] text-white py-2 px-6 rounded-lg shadow-md hover:bg-[#074799] focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300"
                    onClick={handleHandOver}
                  >
                    Hand Over
                  </button>
                )}
              </div>
            </div>
          )}


          {/* Show New Activity Form if New Assign button is clicked */}
          {showNewActivityForm && mobileData && (
            <div className="mt-6 p-4 bg-gray-100 border border-[#A888B5] rounded-md">
              <h3 className="text-xl font-bold text-[#001A6E]">Add New Activity:</h3>
              <form onSubmit={handleAddActivity}>
                <div className="mt-4">
                  <label htmlFor="activity" className="block font-medium text-[#001A6E]">Activity</label>
                  <input
                    type="text"
                    id="activity"
                    name="activity"
                    value={newActivity.activity}
                    onChange={handleActivityChange}
                    required
                    className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="remark" className="block font-medium text-[#001A6E]">Remark</label>
                  <textarea
                    id="remark"
                    name="remark"
                    value={newActivity.remark}
                    onChange={handleActivityChange}
                    required
                    className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <label htmlFor="person" className="block font-medium text-[#001A6E]">Person</label>
                  <input
                    type="text"
                    id="person"
                    name="person"
                    value={newActivity.person}
                    onChange={handleActivityChange}
                    required
                    className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="description" className="block font-medium text-[#001A6E]">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newActivity.description}
                    onChange={handleActivityChange}
                    required
                    className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <label htmlFor="activityStatus" className="block font-medium text-[#001A6E]">Activity Status</label>
                  <select
                    id="activityStatus"
                    name="activityStatus"
                    value={newActivity.activityStatus}
                    onChange={handleActivityChange}
                    required
                    className="w-full mt-1 border-[#A888B5] rounded-md shadow-sm"
                  >
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>
                <input type="hidden" name="idMobile" value={mobileData.idMobile} />
                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-[#001A6E] text-white py-2 px-6 rounded-md font-bold transition duration-300 hover:bg-[#074799]"
                  >
                    Add Activity
                  </button>
                </div>
              </form>
            </div>
          )}



          {/* Activity Table */}
          {activities.length > 0 && (
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-bold text-[#001A6E] mb-6 text-center">Activity History</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Activity</th>
                    <th className="px-4 py-2 border-b text-left">Person</th>
                    <th className="px-4 py-2 border-b text-left">Description</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">Created Date</th>
                    <th className="px-4 py-2 border-b text-left">Modified Date</th>
                    <th className="px-4 py-2 border-b text-left">Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity.idMobileActivity} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{activity.activity}</td>
                      <td className="px-4 py-2 border-b">{activity.person}</td>
                      <td className="px-4 py-2 border-b">{activity.description}</td>
                      <td className="px-4 py-2 border-b">{activity.activityStatus}</td>
                      <td className="px-4 py-2 border-b">{new Date(activity.createdDate).toLocaleString()}</td>
                      <td className="px-4 py-2 border-b">{new Date(activity.modifiedDate).toLocaleString()}</td>
                      <td className="px-4 py-2 border-b">{activity.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

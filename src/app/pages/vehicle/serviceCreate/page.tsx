import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function CreateService() {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
    <Header/>
  
        {/* Main Content */}
        <main className="flex-grow flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl grid gap-6">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
              Create Service
            </h2>
  
            {/* Form Fields */}
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block font-medium">
                  Service Type
                </label>
                <input
                  type="text"
                  id="serviceType"
                  placeholder="Enter service type"
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
  
              {/* Service Date */}
              <div>
                <label htmlFor="serviceDate" className="block font-medium">
                  Service Date
                </label>
                <input
                  type="date"
                  id="serviceDate"
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
  
              {/* Description */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="description" className="block font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter service description"
                  rows={4}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
  
              {/* Vehicle Registration Number */}
              <div>
                <label htmlFor="vehicleRegistrationNo" className="block font-medium">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  id="vehicleRegistrationNo"
                  placeholder="Enter vehicle registration number"
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </form>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="col-span-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </main>
  
        <Footer/>
      </div>
    );
  }
  
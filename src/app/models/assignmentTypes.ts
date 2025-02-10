
// src/types/assignmentTypes.ts
export interface MobileAssignRequest {
  mobileId: number;
  isPermanentMobile: boolean;
}

export interface VehicleAssignRequest {
  vehicleId: number;
  isPermanentVehicle: boolean;
}

export interface AssignPayload {
  employeeId: number;
  type: string[];
  mobileAssignRequest?: MobileAssignRequest;
  vehicleAssignRequest?: VehicleAssignRequest;
}
  
  export interface ApiResponse {
    status: number;
    data: any; // Adjust this according to your API response shape
  }




  
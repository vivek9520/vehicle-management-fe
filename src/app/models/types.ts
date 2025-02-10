export interface Office {
    idOffice: number;
    officeName: string;
    companyId: number;
  }
  
  // Define the type for a company
  export interface Company {
    idCompany: number;
    companyName: string;
    offices: Office[];
  }


  export interface Vehicle {
    idVehicle:number
    dateOfFirstCommissioning: string;
    acquisitionDate: string;
    registrationNo: string;
    vehicleCategory: string;
    brand: string;
    tradeDesignation: string;
    eidentificationNumber: string;
    color: string;
    emissionClass: string;
    co2Level: string;
    fuel: string;
    insuranceCompany: string;
    rearTireDimension: string;
    idOffice: string;
    idCompany:string;
    dateOfControlCurrent:string,
    dateOfControlNext:string,
    status:string
  }

  export interface ServiceHistory{
      idService: string,
      serviceType: string,
      serviceDate: string,
      description:string,
      VehicleInfoL:Vehicle
  }

  export interface Subscription{
    idMobileSubscription: string,
    subscriptionName: string,
    fee: string
    
}

// Interface for MobileSubscription
export interface MobileSubscription {
  idMobileSubscription: number;
  subscriptionName: string;
  fee: string;
}

// Interface for Mobile
export interface Mobile {
  idMobile: number;
  mobileUniCode: string;
  mobileModel: string;
  idOffice: number;
  status: string; 
  mobileNumber: string;
  mobileSubscriptionDTO: MobileSubscription;
}

export interface Employee {
  idEmployee: number;
  uniqueId: string;
  employeeName: string;
  status: 'Active' | 'Inactive';  
}

export interface AssignmentData {
  idAssignment: number;
  employee: Employee;
  mobile: Mobile;
  vehicle: Vehicle;
  permanentVehicle: boolean;
  permanentMobile: boolean;
}


  
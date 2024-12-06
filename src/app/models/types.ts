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
    dateOfFirstCommissioning: string;
    acquisitionDate: string;
    registrationNo: string;
    vehicleCategory: string;
    brand: string;
    tradeDesignation: string;
    eIdentificationNumber: string;
    color: string;
    emissionClass: string;
    co2Level: string;
    fuel: string;
    insuranceCompany: string;
    rearTireDimension: string;
    idOffice: string;
    idCompany:string;
    dateOfControlCurrent:string,
    dateOfControlNext:string
  }
  
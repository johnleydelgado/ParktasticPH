interface ParkingLotProps {
  [key: string]: any;
}

interface FacilitiesProps {
  camera: boolean;
  charging: boolean;
  covered_roof: boolean;
  disabled_parking: boolean;
  overnight: boolean;
  security_guard: boolean;
  valet_parking: boolean;
}

export interface ParkingSpacesProps {
  id?: string;
  address: string;
  name: string;
  parking_lot: ParkingLotProps;
  rate: number;
  rules: string;
  time_from: string;
  time_to: string;
  facilities: FacilitiesProps;
  km?: number;
  m?: number;
  location?: {lat: number; lng: number};
  payment_options: {gcash: boolean; wallet: boolean};
}

export interface BookingProps {
  booking_date: any;
  duration: number;
  parking_space_id: string;
  payment_method: 'gcash' | 'wallet';
  plate_no: string;
  qr_code: string;
  rate: number;
  vehicle: string;
}

export interface VehicleProps {
  brand: string;
  licenseNum: string;
  make: string;
  modelYear: string;
}

export interface ParkingSlotsProps {
  slot: any;
}

export interface SignUpUserProps {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

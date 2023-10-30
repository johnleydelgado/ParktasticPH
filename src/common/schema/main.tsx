export interface ParkingLotProps {
  id: string;
  parkingAttendantId: string;
}

export interface ParkingLotDataProps {
  [x: string]: string | undefined;
  lotId: string;
  status: string;
  userId: string;
  parkingLotId?: string;
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
  parking_lot: ParkingLotDataProps[];
  rate: number;
  rules: string;
  time_from: string;
  time_to: string;
  facilities: FacilitiesProps;
  km?: number;
  m?: number;
  location?: {lat: number; lng: number};
  createdById?: string;
  payment_options: {gcash: boolean; wallet: boolean};
}

export interface BookingProps {
  id?: string;
  booking_date: any;
  duration: number;
  parking_space_id: string;
  payment_method: 'gcash' | 'wallet';
  plate_no: string;
  qr_code: qrProps;
  rate: number;
  vehicle: string;
  address?: string;
  beginTime?: any;
  createdById?: string;
}

export interface VehicleProps {
  brand: string;
  licenseNum: string;
  make: string;
  modelYear: string;
}

export interface ParkingSlotsProps {
  lotId: string;
  status: 'Available' | 'Not Available';
  userId: string;
}

export interface qrProps {
  qrCode: string;
  email: string;
  bookingId: string;
  lotId: string;
  address: string;
  parkingLotId: string;
  parkingSpaceId: string;
  booking_date: any;
}

export interface bookingLogsProps {
  timeLog: string;
  qrCode: string;
  email: string;
  bookingId: string;
  lotId: string;
  address: string;
  parkingLotId: string;
  parkingSpaceId: string;
}

export interface listOfBookingProps {
  timeLog: string;
  qrCode: string;
  email: string;
  bookingId: string;
  lotId: string;
  address: string;
  parkingLotId: string;
  parkingSpaceId: string;
  status: 'Available' | 'Reserved' | 'Not Available';
}

export interface SignUpUserProps {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: 'Driver' | 'Parktastic Partner' | 'Parktastic Buddy';
}

export interface EmailProps {
  to: string;
  message: {html: string; subject: string; text: string};
}

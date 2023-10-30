import {
  BookingProps,
  ParkingSpacesProps,
  listOfBookingProps,
} from '@/common/schema/main';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ManualBookingProps {
  booking_date: any;
  duration: number;
  payment_method: string;
  plate_no: string;
  vehicle: string;
}

interface CommonState {
  openModals: any[];
  isOpenParkingBooking: boolean;
  searchLocLatLang: {lng: string; lat: string} | null;
  parkingSpaceData: ParkingSpacesProps | null;
  selectedBooking: BookingProps | null;
  selectedParkingLot: listOfBookingProps | null;
  selectedBookingDate: {duration: number; bookingDate: string} | null;
  manualBooking: ManualBookingProps | null;
}

const initialState: CommonState = {
  openModals: [],
  isOpenParkingBooking: false,
  searchLocLatLang: null,
  parkingSpaceData: null,
  selectedBooking: null,
  selectedParkingLot: null,
  selectedBookingDate: null,
  manualBooking: null,
};

export const nonPersistState = createSlice({
  name: 'nonPersistState',
  initialState,
  reducers: {
    /**
     * OPEN_MODAL
     * @param {string} action.payload - name of modal to be opened
     * @returns {string[]} array of name of modals that should be opened
     */
    openModal: (state, action: PayloadAction<string>) => {
      state.openModals =
        state.openModals.filter(x => x === action.payload).length > 0
          ? state.openModals
          : [...state.openModals, action.payload];
    },
    /**
     * CLOSE_MODAL
     * @param {string} action.payload - name of modal to be closed
     * @returns {string[]} array of name of modals without the payload
     */
    closeModal: (state, action) => {
      state.openModals =
        state.openModals.filter(x => x === action.payload).length > 0
          ? state.openModals.filter(x => x !== action.payload)
          : state.openModals;
    },
    resetModal: state => {
      state.openModals = [];
      state.isOpenParkingBooking = false;
    },
    setOpenParkingBooking: (state, action: PayloadAction<boolean>) => {
      state.isOpenParkingBooking = action.payload;
    },
    setSearchLocLatLang: (
      state,
      action: PayloadAction<{lng: string; lat: string}>,
    ) => {
      state.searchLocLatLang = action.payload;
    },
    setParkingSpaceData: (state, action: PayloadAction<ParkingSpacesProps>) => {
      state.parkingSpaceData = action.payload;
    },
    setSelectedBooking: (state, action: PayloadAction<BookingProps>) => {
      state.selectedBooking = action.payload;
    },
    setSelectedParkingLot: (
      state,
      action: PayloadAction<listOfBookingProps | null>,
    ) => {
      state.selectedParkingLot = action.payload;
    },
    setSelectedBookingDate: (
      state,
      action: PayloadAction<{duration: number; bookingDate: string} | null>,
    ) => {
      state.selectedBookingDate = action.payload;
    },
    setManualBooking: (
      state,
      action: PayloadAction<ManualBookingProps | null>,
    ) => {
      state.manualBooking = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  openModal,
  closeModal,
  resetModal,
  setOpenParkingBooking,
  setSearchLocLatLang,
  setParkingSpaceData,
  setSelectedBooking,
  setSelectedParkingLot,
  setSelectedBookingDate,
  setManualBooking,
} = nonPersistState.actions;

export default nonPersistState.reducer;

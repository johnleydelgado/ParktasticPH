import {ParkingSpacesProps} from '@/common/schema/main';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CommonState {
  openModals: any[];
  isOpenParkingBooking: boolean;
  searchLocLatLang: {lng: string; lat: string} | null;
  parkingSpaceData: ParkingSpacesProps | null;
}

const initialState: CommonState = {
  openModals: [],
  isOpenParkingBooking: false,
  searchLocLatLang: null,
  parkingSpaceData: null,
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
} = nonPersistState.actions;

export default nonPersistState.reducer;

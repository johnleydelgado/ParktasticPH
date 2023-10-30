import {VehicleProps} from '@/common/schema/main';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserProps {
  name: string;
  email: string;
  phoneNumber: string;
  role: 'Driver' | 'Parktastic Partner' | 'Parktastic Buddy' | string;
}

interface CommonState {
  openModals: any[];
  user: UserProps;
  selectedVehicle: VehicleProps;
}

const initialState: CommonState = {
  openModals: [],
  user: {name: '', email: '', phoneNumber: '', role: ''},
  selectedVehicle: {brand: '', licenseNum: '', make: '', modelYear: ''},
};

export const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserProps>) => {
      state.user = action.payload;
    },
    setSelectedVehicle: (state, action: PayloadAction<VehicleProps>) => {
      state.selectedVehicle = action.payload;
    },
    resetCommonState: state => {
      state.selectedVehicle = initialState.selectedVehicle;
      state.user = initialState.user;
      state.openModals = initialState.openModals;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUserData, setSelectedVehicle, resetCommonState} =
  common.actions;

export default common.reducer;

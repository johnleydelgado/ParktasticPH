import {VehicleProps} from '@/common/schema/main';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface UserProps {
  name: string;
  email: string;
  phoneNumber: string;
}

interface CommonState {
  openModals: any[];
  user: UserProps;
  selectedVehicle: VehicleProps;
}

const initialState: CommonState = {
  openModals: [],
  user: {name: '', email: '', phoneNumber: ''},
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
  },
});

// Action creators are generated for each case reducer function
export const {setUserData, setSelectedVehicle} = common.actions;

export default common.reducer;

import {modalName} from '@/common/constant/modal';
import {openModal} from '@/redux/nonPersistState';

const modalProps = (dispatch: any) => [
  {
    title: 'This parking lot is open for use.',
    subTitle: 'Please select actions',
    firstButton: 'Add booking',
    firstButtonColor: '',
    secondButton: 'Report an illegal parking',
    secondButtonColor: '',
    firstPress: () => dispatch(openModal(modalName.ADMIN_ADD_BOOKING)),
    secondPress: () => dispatch(openModal(modalName.ADMIN_REPORT_BOOKING)),
  },
  {
    title: 'Someone has already reserved a parking spot here.',
    subTitle: 'Please select actions',
    firstButton: 'Close',
    firstButtonColor: '',
    firstPress: () => console.log(''),
  },
  // {
  //   title: 'This parking space is already occupied.',
  //   subTitle: 'Please select actions',
  //   firstButton: 'End Session',
  //   firstButtonColor: '',
  //   firstPress: () => dispatch(openModal(modalName.ADMIN_ADD_BOOKING)),
  // },
];

export default modalProps;

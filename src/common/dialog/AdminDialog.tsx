import {Button, HStack} from 'native-base';
import * as React from 'react';
import {Dialog, Portal, Text} from 'react-native-paper';

export interface ModalAdminProps {
  title: string;
  subTitle: string;
  firstButton: string;
  firstButtonColor: string;
  secondButton?: string;
  secondButtonColor?: string;
  visibleModal?: any;
  setVisibleModal?: any;
  setModalPropsData?: any;
  firstPress?: any;
  secondPress?: any;
}

const AdminDialog: React.FC<ModalAdminProps> = ({
  title,
  subTitle,
  setVisibleModal,
  visibleModal,
  firstButton,
  firstButtonColor,
  secondButton,
  secondButtonColor,
  setModalPropsData,
  firstPress,
  secondPress,
}) => {
  const hideDialog = () => {
    setVisibleModal(false);
    setModalPropsData(null);
  };

  return (
    <Portal>
      <Dialog visible={visibleModal} onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{subTitle}</Text>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <HStack space={2}>
            <Button
              onPress={() => {
                firstPress();
                hideDialog();
              }}
              rounded="3xl"
              bgColor={firstButtonColor ? firstButtonColor : 'green.500'}>
              {firstButton}
            </Button>
            {secondButton ? (
              <Button
                onPress={() => {
                  secondPress();
                  hideDialog();
                }}
                rounded="3xl"
                bgColor={secondButtonColor ? secondButtonColor : 'red.400'}>
                {secondButton}
              </Button>
            ) : null}
          </HStack>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AdminDialog;

import { Alert } from 'react-native';

interface ConfirmOptions {
  title: string;
  text: string;
  isDark: boolean;
  onConfirm: () => void;
}

export const showDeleteConfirmation = ({ title, text, isDark, onConfirm }: ConfirmOptions) => {
  Alert.alert(
    title,
    text,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, delete it!',
        style: 'destructive',
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
};

interface AlertOptions {
  title: string;
  text: string;
  isDark: boolean;
  confirmButtonColor?: string;
}

export const showAlert = ({ title, text }: AlertOptions) => {
  Alert.alert(title, text, [{ text: 'OK' }]);
};


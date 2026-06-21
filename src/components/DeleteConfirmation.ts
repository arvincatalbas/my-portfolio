import { Alert } from 'react-native';

interface ConfirmOptions {
  title: string;
  text: string;
  isDark: boolean;
  onConfirm: () => void | Promise<void>;
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

export const showArchiveConfirmation = ({ title, text, isDark, onConfirm }: ConfirmOptions) => {
  Alert.alert(
    title,
    text,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, archive it!',
        style: 'default',
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
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
}

export const showAlert = ({ title, text }: AlertOptions) => {
  Alert.alert(title, text, [{ text: 'OK' }]);
};

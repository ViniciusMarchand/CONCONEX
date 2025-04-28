import Toast from "react-native-toast-message";

export const errorToast = (text: string) => {
    Toast.show({
        type: 'error',
        text1: text,
        swipeable: true,
    });
}

export const successToast = (text: string) => {
    Toast.show({
        type: 'success',
        text1: text,
        swipeable: true,
    });
}
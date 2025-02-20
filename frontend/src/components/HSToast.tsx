import { ToastContainer, toast, Zoom, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const globalOptions: ToastOptions<unknown> = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

const ErrorToast = (content: string, options?: ToastOptions<unknown>): void => {
    toast.error(content, {
        ...globalOptions,
        ...(options ?? {}),
    });
};
const WarnToast = (content: string, options?: ToastOptions<unknown>): void => {
    toast.warn(content, {
        ...globalOptions,
        ...(options ?? {}),
    });
};
const SuccessToast = (
    content: string,
    options?: ToastOptions<unknown>
): void => {
    toast.success(content, {
        ...globalOptions,
        ...(options ?? {}),
    });
};
const HSToast = () => {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            transition={Zoom}
            closeOnClick
            // rtl={false}
            pauseOnFocusLoss
            draggable
            // pauseOnHover
            // stacked
            // limit={2}
        />
    );
};

export default HSToast;

export const Toast = { ErrorToast, WarnToast, SuccessToast };

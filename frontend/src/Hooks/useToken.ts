import useLocalStorage from "./useLocalStorage";

const useToken = () => {
    return useLocalStorage<string | null>("token", null);
};

export default useToken;

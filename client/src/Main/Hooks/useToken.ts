import useLocalStorage from "./useLocalStorage.js";

const useToken = () => {
    return useLocalStorage<string | null>("token", null);
};

export default useToken;

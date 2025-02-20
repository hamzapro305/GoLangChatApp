import { useAppSelector } from '../Redux/Hooks';

const useUser = () => {
    return useAppSelector((s) => s.GlobalVars.user);
}

export default useUser
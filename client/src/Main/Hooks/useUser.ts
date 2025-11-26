import { useQuery } from '@tanstack/react-query';
import useToken from './useToken.js';
import { useAppSelector } from '@/Redux/Hooks.js';
import UserService from '@/utils/UserService.js';

const useUser = () => {
    return useAppSelector((s) => s.GlobalVars.user);
}

const useAnyUser = (userId: string) => {
    const [token, _] = useToken();
    const query = useQuery({
        queryKey: [userId],
        queryFn: () => {
            return UserService.fetchUserById(userId, token as string);
        },
        staleTime: Infinity,
        placeholderData: {
            createdAt: "",
            email: "User name",
            id: "13",
            name: "Someone",
        },
    });
    return query.data
}

export {
    useAnyUser
}

export default useUser
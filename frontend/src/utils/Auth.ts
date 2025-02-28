import apiClient from "./Axios"

type SuccessResponse = {
    token: string
}
type AuthError = {
    error: string;
};

type AuthResponse = SuccessResponse | AuthError;

const Login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post("/auth/login", { email, password });

        if (response.data?.token) {
            return response.data as SuccessResponse;
        } else {
            return { error: "Invalid login response from server" };
        }
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data?.error || "Login failed" };
        }
        return { error: "Network error or server unreachable" };
    }
};

const Register = async (userName: string, email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post("/auth/register", { email, password, name: userName ?? "Noob" });
        if (response.data?.token) {
            return response.data as SuccessResponse;
        } else {
            return { error: "Invalid registration response from server" };
        }
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data?.error || "Registration failed" };
        }
        return { error: "Network error or server unreachable" };
    }
};


export const Auth = {
    Login,
    Register
}
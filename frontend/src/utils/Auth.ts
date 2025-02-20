import apiClient from "./Axios"

const Login = async (email: string, password: string): Promise<{ token: string }> => {
    const body = JSON.stringify({
        email: email,
        password: password
    })
    return new Promise(async (res, rej) => {
        try {
            const response = await apiClient.post("/auth/login", body)
            const data: { token: string } = JSON.parse(response.data)

            console.log(response.data)
            res(data)
        } catch (error) {
            console.log(error)
            rej(null)
        }
    })
}

export const Auth = {
    Login,
}
import apiClient from "./Axios"

const GetCurrentUser = async (token: string): Promise<any> => {
    return new Promise(async (res, rej) => {
        try {
            const response = await apiClient.get("/user/getCurrentUser", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = JSON.parse(response.data)
            res(data?.user)
        } catch (error) {
            console.log(error)
            rej(null)
        }
    })
}

const UserService = {
    GetCurrentUser
}

export default UserService
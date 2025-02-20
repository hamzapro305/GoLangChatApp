import { Participant, SimpleConversation } from "../@types/chat"
import { User } from "../Redux/slices/GlobalVars"
import apiClient from "./Axios"

const GetCurrentUser = async (token: string): Promise<any> => {
    return new Promise(async (res, rej) => {
        try {
            const response = await apiClient.get("/user/getCurrentUser", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.status == 200) {
                const data = JSON.parse(response.data)
                res(data?.user)
            }
            rej(null)
        } catch (error) {
            console.log(error)
            rej(null)
        }
    })
}

const GetAllUsers = async (token: string): Promise<User[]> => {
    return new Promise(async (res, rej) => {
        try {
            const response = await apiClient.get("/user/get", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = JSON.parse(response.data)
            res(data?.users)
        } catch (error) {
            console.log(error)
            rej(null)
        }
    })
}

const fetchUserById = async (userId: string, token: string): Promise<User> => {
    return new Promise(async (res, rej) => {
        const body = JSON.stringify({
            userId: userId
        })
        try {
            const response = await apiClient.post("/user/getUserById", body, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = JSON.parse(response.data)
            res(data.user)
        } catch (error) {
            console.log(error)
            rej(null)
        }
    })
}

const GetChatParticipant = (currentUser: User, conversation: SimpleConversation): Participant => {
    return conversation.participants.filter(
        (user) => user.userId != currentUser?.id
    )?.[0];
}

const UserService = {
    GetCurrentUser,
    GetAllUsers,
    GetChatParticipant,
    fetchUserById
}

export default UserService
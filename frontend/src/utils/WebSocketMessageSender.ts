

export class WebSocketMessageSender {
    static createNewMessage = (
        ws: WebSocket,
        message: {
            conversationId: string,
            content: string,
            tempId: string
        }
    ) => {
        const data = JSON.stringify({
            type: "create_message",
            conversationId: message.conversationId,
            content: message.content,
            tempId: message.tempId
        });
        ws.send(data);
    };
    static createNewConversation = (ws: WebSocket, users: string[]) => {
        const body = JSON.stringify({
            type: "create_conversation",
            participants: users
        })
        ws.send(body);
    }
    static createNewGroupConversation = (ws: WebSocket, users: string[], groupName: string) => {
        const body = JSON.stringify({
            type: "create_group_conversation",
            participants: users,
            groupName: groupName
        })
        ws.send(body);
    }
}

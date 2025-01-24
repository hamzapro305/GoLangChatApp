export class WebSocketMessageSender {
    static createNewMessage = (
        ws: WebSocket,
        convId: string,
        content: string
    ) => {
        const data = JSON.stringify({
            type: "create_message",
            conversationId: convId,
            content: content,
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

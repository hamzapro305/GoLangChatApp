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
}

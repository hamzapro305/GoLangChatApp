package middlewares

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func setupWebsocket(app *fiber.App) {
	app.Use("/api/v1/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)

			return ProtectedRoute()(c)
		}
		return fiber.ErrUpgradeRequired
	})

}

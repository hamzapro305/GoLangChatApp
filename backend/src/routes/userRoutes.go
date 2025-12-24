package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/controllers"
)

func SetupUserRoutes(userRouter fiber.Router) {
	userRouter.Get("/get", controllers.UserController.GetUsers)
	userRouter.Get("/getCurrentUser", controllers.UserController.GetCurrentUser)
	userRouter.Post("/getUserById", controllers.UserController.GetUserById)
	userRouter.Post("/updateName", controllers.UserController.UpdateName)
	userRouter.Post("/updatePassword", controllers.UserController.UpdatePassword)
}

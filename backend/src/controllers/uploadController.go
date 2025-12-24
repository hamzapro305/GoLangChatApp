package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/hamzapro305/GoLangChatApp/src/repos"
)

type uploadController struct{}

var UploadController = &uploadController{}

func (*uploadController) UploadFile(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No file uploaded",
		})
	}

	// Use StorageRepo to handle the upload
	fileUrl, err := repos.StorageRepo.UploadFile(file, c.SaveFile)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Return file URL
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"url":      fileUrl,
		"fileName": file.Filename,
		"size":     file.Size,
		"type":     file.Header.Get("Content-Type"),
	})
}

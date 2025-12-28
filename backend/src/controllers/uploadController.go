package controllers

import (
	"fmt"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
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

	// Create a unique filename
	filename := fmt.Sprintf("%d-%s", time.Now().Unix(), file.Filename)
	savePath := filepath.Join("./uploads", filename)

	// Save file to root/uploads
	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save file",
		})
	}

	// Assuming the server is running on localhost:3001 and serves /uploads
	fileUrl := fmt.Sprintf("/uploads/%s", filename)

	// Return file URL
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"url":      fileUrl,
		"fileName": file.Filename,
		"size":     file.Size,
		"type":     file.Header.Get("Content-Type"),
	})
}

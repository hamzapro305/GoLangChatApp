package controllers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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

	// Create uploads directory if not exists
	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
		os.Mkdir("./uploads", 0755)
	}

	// Generate unique filename
	extension := filepath.Ext(file.Filename)
	uniqueId := uuid.New().String()
	fileName := fmt.Sprintf("%d-%s%s", time.Now().Unix(), uniqueId, extension)
	filePath := filepath.Join("./uploads", fileName)

	// Save file to disk
	if err := c.SaveFile(file, filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save file",
		})
	}

	// Return file URL
	fileUrl := fmt.Sprintf("http://localhost:3001/uploads/%s", fileName)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"url":      fileUrl,
		"fileName": file.Filename,
		"size":     file.Size,
		"type":     file.Header.Get("Content-Type"),
	})
}

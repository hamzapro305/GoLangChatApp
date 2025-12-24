package repos

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type storageRepo struct{}

var StorageRepo = &storageRepo{}

func (*storageRepo) UploadFile(file *multipart.FileHeader, saveFunc func(*multipart.FileHeader, string) error) (string, error) {
	// Create uploads directory if not exists
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		err = os.Mkdir(uploadDir, 0755)
		if err != nil {
			return "", fmt.Errorf("failed to create upload directory: %v", err)
		}
	}

	// Generate unique filename
	extension := filepath.Ext(file.Filename)
	uniqueId := uuid.New().String()
	fileName := fmt.Sprintf("%d-%s%s", time.Now().Unix(), uniqueId, extension)
	filePath := filepath.Join(uploadDir, fileName)

	// Save file using the provided function (usually c.SaveFile from Fiber)
	if err := saveFunc(file, filePath); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return file URL
	fileUrl := fmt.Sprintf("http://localhost:3001/uploads/%s", fileName)
	return fileUrl, nil
}

package repos

import (
	"mime/multipart"
)

type storageRepo struct{}

var StorageRepo = &storageRepo{}

func (*storageRepo) uploadFile(fileName string, file *multipart.FileHeader) error {
	return nil

}

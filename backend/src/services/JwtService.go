package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/hamzapro305/GoLangChatApp/src/models"
)

type jwtService struct{}

var JwtService = &jwtService{}

var secretKey = []byte("I Want Something Just Like this Todo do do do dooo!")

type UserClaims struct {
	Email  string `json:"email"`
	Exp    string `json:"exp"`
	UserID string `json:"userId"`
}

func (*jwtService) GetClaims(c *fiber.Ctx) (UserClaims, error) {
	// Retrieve user claims safely from c.Locals
	userClaims := c.Locals("userClaims")

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		return UserClaims{}, errors.New("unauthorized: missing or invalid user claims")
	}

	// Extract values safely
	email, _ := claims["email"].(string)
	exp, _ := claims["exp"].(string)
	userID, _ := claims["userId"].(string)

	// Return the structured UserClaims
	return UserClaims{
		Email:  email,
		Exp:    exp,
		UserID: userID,
	}, nil
}

func (*jwtService) GetSocketClaims(c *websocket.Conn) (UserClaims, error) {
	// Retrieve user claims safely from c.Locals
	userClaims := c.Locals("userClaims")

	claims, ok := userClaims.(jwt.MapClaims)
	if !ok {
		return UserClaims{}, errors.New("unauthorized: missing or invalid user claims")
	}

	// Extract values safely
	email, _ := claims["email"].(string)
	exp, _ := claims["exp"].(string)
	userID, _ := claims["userId"].(string)

	// Return the structured UserClaims
	return UserClaims{
		Email:  email,
		Exp:    exp,
		UserID: userID,
	}, nil
}

// CreateToken generates a JWT token with custom claims
func (*jwtService) CreateToken(email string, password string, user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"userId":   user.ID.Hex(),
		"email":    email,
		"password": password,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	// Create token using the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token using the secret key
	return token.SignedString(secretKey)
}

// VerifyToken parses and validates the given token
func (*jwtService) VerifyToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	// Check if the token is valid
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, fmt.Errorf("invalid token")
	}
}

func (*jwtService) GetToken(c *fiber.Ctx) (string, error) {
	// Extract the token from the Authorization header
	authHeader := c.Get("Authorization")

	// Check if the header is present and properly formatted
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return "", nil
	}

	// Extract the token part, removing "Bearer " prefix
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	return tokenString, nil
}

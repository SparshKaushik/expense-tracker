package auth

import (
	"log"
	"strings"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

func NewClerkClient(key string) clerk.Client {
	log.Println("API_KEY", key)
	client, err := clerk.NewClient(key)
	if err != nil {
		panic(err)
	}
	return client
}

func ValidateSession(clerkClient clerk.Client, sessionToken string) (*clerk.User, error) {
	sessionToken = strings.TrimPrefix(sessionToken, "Bearer ")
	sessClaims, err := clerkClient.VerifyToken(sessionToken)
	if err != nil {
		return nil, err
	}
	user, err := clerkClient.Users().Read(sessClaims.Claims.Subject)
	if err != nil {
		return nil, err
	}
	log.Println("User", user)
	return user, err
}

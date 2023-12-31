package auth

import (
	"os"
	"strings"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

func NewClerkClient() clerk.Client {
	client, err := clerk.NewClient(os.Getenv("API_KEY"))
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
	return user, err
}

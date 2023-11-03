package user_model

import (
	"context"
	"encoding/json"
	"errors"
	"khata-api/db"
	utils_httpResponse "khata-api/utils"
	"log"
	"net/http"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/julienschmidt/httprouter"
)

func GetUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		utils_httpResponse.AbortInternalServerError(w)
	}
	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			log.Fatal(err)
		}
	}()
	ctx := context.Background()
	userData, err := client.User.FindUnique(
		db.User.ID.Equals(user.ID),
	).Exec(ctx)
	if errors.Is(err, db.ErrNotFound) {
		client.User.CreateOne(
			db.User.ID.Set(user.ID),
			db.User.Name.Set(*user.FirstName+" "+*user.LastName),
			db.User.Email.Set(user.EmailAddresses[0].EmailAddress),
			db.User.Image.Set(user.ProfileImageURL),
			db.User.Funds.Set(0),
		).Exec(ctx)
		userData, err = client.User.FindUnique(
			db.User.ID.Equals(user.ID),
		).Exec(ctx)
	}
	if err != nil {
		utils_httpResponse.AbortInternalServerError(w)
	}
	jsonUserData, err := json.Marshal(userData)
	if err != nil {
		utils_httpResponse.AbortInternalServerError(w)
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(jsonUserData))
}

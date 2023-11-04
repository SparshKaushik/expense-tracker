package user_model

import (
	"context"
	"errors"
	"khata-api/db"
	utils_httpResponse "khata-api/utils/http"
	"net/http"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/julienschmidt/httprouter"
)

func GetUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
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
	utils_httpResponse.WriteJsonAfterMarshallOKResponse(w, userData)
}

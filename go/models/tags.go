package models

import (
	"context"
	"khata-api/db"
	utils_http "khata-api/utils/http"
	"net/http"
	"strconv"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/julienschmidt/httprouter"
)

func GetTag(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	tagID, err := strconv.Atoi(ps.ByName("id"))
	if err != nil {
		utils_http.AbortBadRequest(w)
		return
	}
	tag, err := client.Tag.FindFirst(
		db.Tag.ID.Equals(tagID),
		db.Tag.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		utils_http.AbortNotFound(w)
		return
	}
	utils_http.WriteJsonAfterMarshallOKResponse(w, tag)
}

func GetTags(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	tags, err := client.Tag.FindMany(
		db.Tag.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		utils_http.AbortNotFound(w)
		return
	}
	utils_http.WriteJsonAfterMarshallOKResponse(w, tags)
}

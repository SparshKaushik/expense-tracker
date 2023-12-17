package models

import (
	"context"
	"encoding/json"
	"khata-api/db"
	utils_http "khata-api/utils/http"
	"log"
	"net/http"
	"strconv"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/julienschmidt/httprouter"
)

func GetCategory(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	categoryID, err := strconv.Atoi(ps.ByName("id"))
	if err != nil {
		utils_http.AbortBadRequest(w)
		return
	}
	category, err := client.Category.FindFirst(
		db.Category.ID.Equals(categoryID),
		db.Category.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		utils_http.AbortNotFound(w)
		return
	}
	utils_http.WriteJsonAfterMarshallOKResponse(w, category)
}

func GetCategories(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()

	categories, err := client.Category.FindMany(
		db.Category.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		log.Println(err)
		utils_http.AbortNotFound(w)
		return
	}
	utils_http.WriteJsonAfterMarshallOKResponse(w, categories)
}

func CreateCategory(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	decoder := json.NewDecoder(r.Body)
	var t struct {
		Name string `json:"category"`
	}
	err := decoder.Decode(&t)
	if err != nil {
		log.Println(err)
		utils_http.AbortBadRequest(w)
		return
	}
	if t.Name == "" {
		utils_http.AbortBadRequest(w)
		return
	}
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	_, err = client.Category.CreateOne(
		db.Category.Name.Set(t.Name),
		db.Category.CreatedBy.Link(
			db.User.ID.Equals(user.ID),
		),
	).Exec(ctx)
	if err != nil {
		log.Println(err)
		utils_http.AbortBadRequest(w)
		return
	}
	utils_http.AbortOK(w)
}

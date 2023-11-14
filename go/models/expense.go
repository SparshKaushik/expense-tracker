package models

import (
	"context"
	"encoding/json"
	"errors"
	"khata-api/db"
	utils_httpResponse "khata-api/utils/http"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/julienschmidt/httprouter"
)

func GetExpense(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	expenseID, err := strconv.Atoi(ps.ByName("id"))
	if err != nil {
		utils_httpResponse.AbortBadRequest(w)
		return
	}
	expense, err := client.Expense.FindFirst(
		db.Expense.ID.Equals(expenseID),
		db.Expense.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		utils_httpResponse.AbortNotFound(w)
		return
	}
	utils_httpResponse.WriteJsonAfterMarshallOKResponse(w, expense)
}

func GetExpenses(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	expenses, err := client.Expense.FindMany(
		db.Expense.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		utils_httpResponse.AbortNotFound(w)
		return
	}
	utils_httpResponse.WriteJsonAfterMarshallOKResponse(w, expenses)
}

func CreateExpense(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	decoder := json.NewDecoder(r.Body)
	var t struct {
		Title       *string  `json:"title,omitempty"`
		Type        string   `json:"type"`
		Amount      float64  `json:"amount"`
		FinalAmount float64  `json:"final_amount"`
		Split       *db.JSON `json:"split,omitempty"`
		Category    string   `json:"category"`
		Tags        *string  `json:"tags,omitempty"`
		DateTime    int64    `json:"dateTime"`
	}
	err := decoder.Decode(&t)
	if err != nil {
		log.Println(err)
		utils_httpResponse.AbortBadRequest(w)
		return
	}
	err = validateCreateExpensePostBody(&t)
	if err != nil {
		utils_httpResponse.AbortBadRequestWithCustomError(w, err)
		return
	}
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	_, err = client.Expense.CreateOne(
		db.Expense.Amount.Set(t.Amount),
		db.Expense.FinalAmount.Set(t.Amount),
		db.Expense.Category.Set(t.Category),
		db.Expense.CreatedBy.Link(
			db.User.ID.Equals(user.ID),
		),

		db.Expense.Type.Set(t.Type),
		db.Expense.Title.Set(*t.Title),
		db.Expense.DateTime.Set(time.Unix(t.DateTime, 0)),
	).Exec(ctx)
	if err != nil {
		log.Println(err)
		utils_httpResponse.AbortBadRequest(w)
		return
	}
	utils_httpResponse.AbortOK(w)
}

func CreateLazyExpense(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	decoder := json.NewDecoder(r.Body)
	var t struct {
		Type        string  `json:"type"`
		Amount      float64 `json:"amount"`
		FinalAmount float64 `json:"final_amount"`
		Category    string  `json:"category"`
		DateTime    int64   `json:"dateTime"`
	}
	err := decoder.Decode(&t)
	if err != nil {
		log.Println(err)
		utils_httpResponse.AbortBadRequest(w)
		return
	}
	err = validateCreateLazyExpensePostBody(&t)
	if err != nil {
		utils_httpResponse.AbortBadRequestWithCustomError(w, err)
		return
	}
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	_, err = client.Expense.CreateOne(
		db.Expense.Amount.Set(t.Amount),
		db.Expense.FinalAmount.Set(t.Amount),
		db.Expense.Category.Set(t.Category),
		db.Expense.CreatedBy.Link(
			db.User.ID.Equals(user.ID),
		),

		db.Expense.Type.Set(t.Type),
		db.Expense.DateTime.Set(time.Unix(t.DateTime/1000, 0)),
	).Exec(ctx)
	if err != nil {
		log.Println(err)
		utils_httpResponse.AbortBadRequest(w)
		return
	}
	utils_httpResponse.AbortOK(w)
}

func validateCreateExpensePostBody(t *struct {
	Title       *string  `json:"title,omitempty"`
	Type        string   `json:"type"`
	Amount      float64  `json:"amount"`
	FinalAmount float64  `json:"final_amount"`
	Split       *db.JSON `json:"split,omitempty"`
	Category    string   `json:"category"`
	Tags        *string  `json:"tags,omitempty"`
	DateTime    int64    `json:"dateTime"`
}) error {
	if t.Title == nil || *t.Title == "" {
		return errors.New("title is required")
	}
	if t.Type == "" {
		return errors.New("type is required")
	}
	if t.Amount <= 0 {
		return errors.New("amount must be greater than 0")
	}
	if t.Category == "" {
		return errors.New("category is required")
	}
	if t.DateTime <= 0 {
		return errors.New("dateTime must be a valid timestamp")
	}
	return nil
}

func validateCreateLazyExpensePostBody(t *struct {
	Type        string  `json:"type"`
	Amount      float64 `json:"amount"`
	FinalAmount float64 `json:"final_amount"`
	Category    string  `json:"category"`
	DateTime    int64   `json:"dateTime"`
}) error {
	if t.Type == "" {
		return errors.New("type is required")
	}
	if t.Amount <= 0 {
		return errors.New("amount must be greater than 0")
	}
	if t.Category == "" {
		return errors.New("category is required")
	}
	if t.DateTime <= 0 {
		return errors.New("dateTime must be a valid timestamp")
	}
	return nil
}

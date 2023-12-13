package models

import (
	"context"
	"encoding/json"
	"errors"
	"khata-api/db"
	utils_http "khata-api/utils/http"
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
		utils_http.AbortBadRequest(w)
		return
	}
	expense, err := client.Expense.FindFirst(
		db.Expense.ID.Equals(expenseID),
		db.Expense.CreatedByID.Equals(user.ID),
	).Exec(ctx)
	if err != nil {
		utils_http.AbortNotFound(w)
		return
	}
	utils_http.WriteJsonAfterMarshallOKResponse(w, expense)
}

func GetExpenses(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User) {
	params := utils_http.GetURLParams(r, map[string]string{
		"limit":             "10",
		"offset":            "0",
		"sortBy":            "dateCreated",
		"sortOrder":         "desc",
		"filterByType":      "",
		"filterByCategory":  "",
		"filterByTag":       "",
		"filterByDateStart": "",
		"filterByDateEnd":   "",
		"searchTitle":       "",
	})
	client, deferFunc := db.GetNewClient(w)
	defer deferFunc()
	ctx := context.Background()
	limit, _ := strconv.Atoi(params["limit"])
	offset, _ := strconv.Atoi(params["offset"])

	// Sort order
	sortOrder := db.SortOrderDesc
	if params["sortOrder"] == "asc" {
		sortOrder = db.SortOrderAsc
	}

	// Sort by
	var orderBy db.ExpenseOrderByParam
	orderBy = db.Expense.DateTime.Order(sortOrder)
	if params["sortBy"] == "amount" {
		orderBy = db.Expense.Amount.Order(sortOrder)
	} else if params["sortBy"] == "dateCreated" {
		orderBy = db.Expense.CreatedAt.Order(sortOrder)
	}

	// Filter by
	filterParams := expenseFilterParams(params)

	expenses, err := client.Expense.FindMany(
		db.Expense.CreatedByID.Equals(user.ID),
		(filterParams["filterByType"]),
		filterParams["filterByCategory"],
		filterParams["filterByTag"],
		filterParams["filterByDateStart"],
		filterParams["filterByDateEnd"],
		filterParams["searchTitle"],
	).Take(limit).Skip(offset).OrderBy(orderBy).Exec(ctx)
	if err != nil {
		log.Println(err)
		utils_http.AbortNotFound(w)
		return
	}
	utils_http.WriteJsonAfterMarshallOKResponse(w, expenses)
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
		utils_http.AbortBadRequest(w)
		return
	}
	err = validateCreateExpensePostBody(&t)
	if err != nil {
		utils_http.AbortBadRequestWithCustomError(w, err)
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
		utils_http.AbortBadRequest(w)
		return
	}
	utils_http.AbortOK(w)
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
		utils_http.AbortBadRequest(w)
		return
	}
	err = validateCreateLazyExpensePostBody(&t)
	if err != nil {
		utils_http.AbortBadRequestWithCustomError(w, err)
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
		utils_http.AbortBadRequest(w)
		return
	}
	utils_http.AbortOK(w)
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

func expenseFilterParams(params map[string]string) map[string]db.ExpenseWhereParam {
	var filterByType db.ExpenseWhereParam = db.Expense.Type.ContainsIfPresent(nil)
	if params["filterByType"] != "" {
		filterByType = db.Expense.Type.Equals(params["filterByType"])
	}
	var filterByCategory db.ExpenseWhereParam = db.Expense.Category.ContainsIfPresent(nil)
	if params["filterByCategory"] != "" {
		filterByCategory = db.Expense.Category.Equals(params["filterByCategory"])
	}
	var filterByTag db.ExpenseWhereParam = db.Expense.Tags.ContainsIfPresent(nil)
	if params["filterByTag"] != "" {
		filterByTag = db.Expense.Tags.Contains(params["filterByTag"])
	}
	var filterByDateStart db.ExpenseWhereParam = db.Expense.DateTime.GteIfPresent(nil)
	if params["filterByDateStart"] != "" {
		dateStart, err := strconv.ParseInt(params["filterByDateStart"][:10], 10, 64)
		if err == nil {
			filterByDateStart = db.Expense.DateTime.Gte(time.Unix(dateStart, 0))
		} else {
			log.Println(err)
		}
	}
	var filterByDateEnd db.ExpenseWhereParam = db.Expense.DateTime.LteIfPresent(nil)
	if params["filterByDateEnd"] != "" {
		dateEnd, err := strconv.ParseInt(params["filterByDateEnd"][:10], 10, 64)
		if err == nil {
			filterByDateEnd = db.Expense.DateTime.Lte(time.Unix(dateEnd, 0))
		} else {
			log.Println(err)
		}
	}
	var searchTitle db.ExpenseWhereParam = db.Expense.Title.ContainsIfPresent(nil)
	if params["searchTitle"] != "" {
		searchTitle = db.Expense.Title.Contains(params["searchTitle"])
	}
	return map[string]db.ExpenseWhereParam{
		"filterByType":      filterByType,
		"filterByCategory":  filterByCategory,
		"filterByTag":       filterByTag,
		"filterByDateStart": filterByDateStart,
		"filterByDateEnd":   filterByDateEnd,
		"searchTitle":       searchTitle,
	}
}

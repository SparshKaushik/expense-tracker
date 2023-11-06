//go:generate go run github.com/steebchen/prisma-client-go generate

package main

import (
	"fmt"
	"khata-api/auth"
	"khata-api/models"
	"log"
	"net/http"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/julienschmidt/httprouter"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Welcome!\n")
}

func middleware(next func(w http.ResponseWriter, r *http.Request, ps httprouter.Params, user *clerk.User)) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		clerkClient := auth.NewClerkClient()
		user, err := auth.ValidateSession(clerkClient, r.Header.Get("Authorization"))
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("401 - Unauthorized"))
			return
		}
		next(w, r, ps, user)
	}
}

func main() {
	router := httprouter.New()

	router.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Access-Control-Request-Method") != "" {
			// Set CORS headers
			header := w.Header()
			header.Set("Access-Control-Allow-Methods", header.Get("Allow"))
			header.Set("Access-Control-Allow-Origin", "*")
		}

		// Adjust status code to 204
		w.WriteHeader(http.StatusNoContent)

	})

	router.GET("/", Index)

	router.GET("/user", middleware(models.GetUser))

	router.GET("/expense", middleware(models.GetExpenses))
	router.GET("/expense/:id", middleware(models.GetExpense))
	router.POST("/expense", middleware(models.CreateExpense))

	router.GET("/tag", middleware(models.GetTags))
	router.GET("/tag/:id", middleware(models.GetTag))

	log.Println("Listening on port 3000")
	log.Println("URL: http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", router))
}

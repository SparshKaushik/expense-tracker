//go:generate go run github.com/steebchen/prisma-client-go generate

package main

import (
	"fmt"
	"khata-api/auth"
	"khata-api/models"
	"log"
	"net/http"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintf(w, `
		<h1>Bruv, What u doin here?</h1>
		<script>
			setTimeout(() => {
				document.getElementsByTagName('h1')[0].innerHTML += '<br><br>fr?'
			}, 2000)
			setTimeout(() => {
				document.getElementsByTagName('h1')[0].innerHTML += '<br><br>u still here?'
			}, 3000)
			setTimeout(() => {
				document.getElementsByTagName('h1')[0].innerHTML += '<br><br>go away'
			}, 5000)
			setTimeout(() => {
				document.getElementsByTagName('h1')[0].innerHTML += '<br><br><br>go do something else<br>don\'t just sit here staring at a screen till you are 60<br>(insert some wobble)<br>go on a hike, touch some grass<br>get a life bro'
			}, 7000)
			setTimeout(() => {
				document.getElementsByTagName('h1')[0].innerHTML += '<br><br>fr tho<br>there is nothing here'
			}, 9000)
		</script>
	`)
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
	godotenv.Load(".env")
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
	router.POST("/expense/lazy", middleware(models.CreateLazyExpense))

	router.GET("/tag", middleware(models.GetTags))
	router.GET("/tag/:id", middleware(models.GetTag))
	router.POST("/tag", middleware(models.CreateTag))

	router.GET("/category", middleware(models.GetCategories))
	router.GET("/category/:id", middleware(models.GetCategory))
	router.POST("/category", middleware(models.CreateCategory))

	log.Println("Listening on port 3000")
	log.Println("URL: http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", router))
}

package main

import (
	"fmt"
	"khata-api/auth"
	"log"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Welcome!\n")
}

func Hello(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	clerkClient := auth.NewClerkClient(os.Getenv("API_KEY"))
	_, err := auth.ValidateSession(clerkClient, r.Header.Get("Authorization"))
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("401 - Unauthorized"))
		return
	}
	fmt.Fprintf(w, "Hello, %s!\n", ps.ByName("name"))
}

func main() {
	log.Println(os.Getenv("API_KEY"))

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

	router.GET("/hello/:name", Hello)

	log.Println("Listening on port 3000")
	log.Println("URL: http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", router))
}

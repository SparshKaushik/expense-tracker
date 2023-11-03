package utils_httpResponse

import "net/http"

func AbortUnauthorized(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
	w.Write([]byte("401 - Unauthorized"))
}

func AbortInternalServerError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("500 - Internal Server Error"))
}

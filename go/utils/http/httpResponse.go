package utils_httpResponse

import (
	"encoding/json"
	"net/http"
)

func AbortOK(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("200 - OK"))
}

func AbortBadRequest(w http.ResponseWriter) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("400 - Bad Request"))
}

func AbortBadRequestWithCustomError(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(err.Error()))
}

func AbortUnauthorized(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
	w.Write([]byte("401 - Unauthorized"))
}

func AbortNotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("404 - Not Found"))
}

func AbortInternalServerError(w http.ResponseWriter) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("500 - Internal Server Error"))
}

func WriteJsonAfterMarshallOKResponse(w http.ResponseWriter, data any) {
	jsonUserData, err := json.Marshal(data)
	if err != nil {
		AbortInternalServerError(w)
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(jsonUserData))
}

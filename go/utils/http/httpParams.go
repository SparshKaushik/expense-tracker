package utils_http

import "net/http"

func GetURLParams(r *http.Request, obj map[string]string) map[string]string {
	params := make(map[string]string)
	for key, defaultValue := range obj {
		params[key] = r.URL.Query().Get(key)
		if params[key] == "" {
			params[key] = defaultValue
		}
	}
	return params
}

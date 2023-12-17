package db

import (
	utils_http "khata-api/utils/http"
	"log"
	"net/http"
)

func GetNewClient(w http.ResponseWriter) (*PrismaClient, func()) {
	client := NewClient()
	if err := client.Prisma.Connect(); err != nil && w != nil {
		utils_http.AbortInternalServerError(w)
	}
	deferFunc := func() {
		if err := client.Prisma.Disconnect(); err != nil {
			log.Println(err)
		}
	}
	return client, deferFunc
}

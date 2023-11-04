package db

import (
	utils_httpResponse "khata-api/utils/http"
	"log"
	"net/http"
)

func GetNewClient(w http.ResponseWriter) (*PrismaClient, func()) {
	client := NewClient()
	if err := client.Prisma.Connect(); err != nil {
		utils_httpResponse.AbortInternalServerError(w)
	}
	deferFunc := func() {
		if err := client.Prisma.Disconnect(); err != nil {
			log.Println(err)
		}
	}
	return client, deferFunc
}

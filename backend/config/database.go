package config

import (
    "fmt"
    "os"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func ConnectDB() (*gorm.DB, error) {
    // Check if using Railway's DATABASE_URL
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL != "" {
        return gorm.Open(postgres.Open(dbURL), &gorm.Config{})
    }

    // Local development connection
    dbHost := os.Getenv("DB_HOST")
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")
    dbPort := os.Getenv("DB_PORT")

    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
        dbHost, dbUser, dbPass, dbName, dbPort)

    return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}
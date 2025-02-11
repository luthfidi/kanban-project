package controllers

import (
    "kanban-project/models"
    "net/http"

    "github.com/labstack/echo/v4"
    "gorm.io/gorm"
)

type UserController struct {
    DB *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
    return &UserController{DB: db}
}

func (uc *UserController) GetProfile(c echo.Context) error {
    userID := c.Get("userID").(uint)

    var user models.User
    if result := uc.DB.First(&user, userID); result.Error != nil {
        return echo.NewHTTPError(http.StatusNotFound, "User not found")
    }

    return c.JSON(http.StatusOK, user.ToResponse())
}
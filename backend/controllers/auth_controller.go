package controllers

import (
    "kanban-project/models"
    "kanban-project/utils"
    "net/http"

    "github.com/labstack/echo/v4"
    "gorm.io/gorm"
)

type AuthController struct {
    DB *gorm.DB
}

type RegisterRequest struct {
    Name     string `json:"name" validate:"required"`
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=6"`
}

type LoginRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

type AuthResponse struct {
    Token string             `json:"token"`
    User  models.UserResponse `json:"user"`
}

func NewAuthController(db *gorm.DB) *AuthController {
    return &AuthController{DB: db}
}

func (ac *AuthController) Register(c echo.Context) error {
    var req RegisterRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
    }

    // Check if email already exists
    var existingUser models.User
    if result := ac.DB.Where("email = ?", req.Email).First(&existingUser); result.Error == nil {
        return echo.NewHTTPError(http.StatusConflict, "Email already registered")
    }

    // Hash password
    hashedPassword, err := utils.HashPassword(req.Password)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to hash password")
    }

    // Create user
    user := models.User{
        Name:     req.Name,
        Email:    req.Email,
        Password: hashedPassword,
    }

    if result := ac.DB.Create(&user); result.Error != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create user")
    }

    // Generate token
    token, err := utils.GenerateToken(user.ID)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate token")
    }

    return c.JSON(http.StatusCreated, AuthResponse{
        Token: token,
        User:  user.ToResponse(),
    })
}

func (ac *AuthController) Login(c echo.Context) error {
    var req LoginRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
    }

    // Find user by email
    var user models.User
    if result := ac.DB.Where("email = ?", req.Email).First(&user); result.Error != nil {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
    }

    // Check password
    if !utils.CheckPasswordHash(req.Password, user.Password) {
        return echo.NewHTTPError(http.StatusUnauthorized, "Invalid credentials")
    }

    // Generate token
    token, err := utils.GenerateToken(user.ID)
    if err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to generate token")
    }

    return c.JSON(http.StatusOK, AuthResponse{
        Token: token,
        User:  user.ToResponse(),
    })
}
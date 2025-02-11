package routes

import (
    "kanban-project/controllers"
    "kanban-project/middleware"

    "github.com/labstack/echo/v4"
    "gorm.io/gorm"
)

func SetupRoutes(e *echo.Echo, db *gorm.DB) {
    // Initialize controllers
    authController := controllers.NewAuthController(db)
    taskController := controllers.NewTaskController(db)
    userController := controllers.NewUserController(db)

    // Auth routes
    auth := e.Group("/auth")
    auth.POST("/register", authController.Register)
    auth.POST("/login", authController.Login)

    // Protected routes
    api := e.Group("/api")
    api.Use(middleware.JWTMiddleware)

    // User routes
    api.GET("/profile", userController.GetProfile)

    // Task routes
    tasks := api.Group("/tasks")
    tasks.GET("", taskController.GetTasks)
    tasks.POST("", taskController.CreateTask)
    tasks.PUT("/:id", taskController.UpdateTask)
    tasks.DELETE("/:id", taskController.DeleteTask)
}
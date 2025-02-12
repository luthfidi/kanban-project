package controllers

import (
    "kanban-project/models"
    "log"
    "net/http"
    "strconv"

    "github.com/labstack/echo/v4"
    "gorm.io/gorm"
)

type TaskController struct {
    DB *gorm.DB
}

func NewTaskController(db *gorm.DB) *TaskController {
    return &TaskController{DB: db}
}

func (tc *TaskController) CreateTask(c echo.Context) error {
    userID := c.Get("userID").(uint)

    var req models.CreateTaskRequest
    if err := c.Bind(&req); err != nil {
        log.Printf("Error binding request: %v", err)
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
    }

    // Log received data for debugging
    log.Printf("Received task data: %+v", req)
    log.Printf("Due date: %v", req.DueDate)

    if req.Color == "" {
        req.Color = "default"
    }

    task := models.Task{
        Title:       req.Title,
        Description: req.Description,
        Category:    req.Category,
        DueDate:     req.DueDate,
        Color:       req.Color,
        UserID:      userID,
        Status:      models.TaskStatusTodo,
    }

    if result := tc.DB.Create(&task); result.Error != nil {
        log.Printf("Error creating task: %v", result.Error)
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create task")
    }

    return c.JSON(http.StatusCreated, task)
}

func (tc *TaskController) GetTasks(c echo.Context) error {
    userID := c.Get("userID").(uint)

    var tasks []models.Task
    if result := tc.DB.Where("user_id = ?", userID).Find(&tasks); result.Error != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch tasks")
    }

    return c.JSON(http.StatusOK, tasks)
}

func (tc *TaskController) UpdateTask(c echo.Context) error {
    userID := c.Get("userID").(uint)
    taskID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid task ID")
    }

    var task models.Task
    if result := tc.DB.Where("id = ? AND user_id = ?", taskID, userID).First(&task); result.Error != nil {
        return echo.NewHTTPError(http.StatusNotFound, "Task not found")
    }

    var req models.UpdateTaskRequest
    if err := c.Bind(&req); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
    }

    // Log received update data for debugging
    log.Printf("Received update task data: %+v", req)
    log.Printf("Update due date: %v", req.DueDate)

    updates := map[string]interface{}{
        "title":       req.Title,
        "description": req.Description,
        "status":      req.Status,
        "category":    req.Category,
        "due_date":    req.DueDate,
        "color":       req.Color,
    }

    if result := tc.DB.Model(&task).Updates(updates); result.Error != nil {
        log.Printf("Error updating task: %v", result.Error)
        return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update task")
    }

    return c.JSON(http.StatusOK, task)
}

func (tc *TaskController) DeleteTask(c echo.Context) error {
    userID := c.Get("userID").(uint)
    taskID, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "Invalid task ID")
    }

    result := tc.DB.Where("id = ? AND user_id = ?", taskID, userID).Delete(&models.Task{})
    if result.RowsAffected == 0 {
        return echo.NewHTTPError(http.StatusNotFound, "Task not found")
    }

    return c.NoContent(http.StatusNoContent)
}
package models

import (
    "time"
)

type TaskStatus string

const (
    TaskStatusTodo       TaskStatus = "todo"
    TaskStatusInProgress TaskStatus = "in_progress"
    TaskStatusDone       TaskStatus = "done"
)

type Task struct {
    ID          uint       `gorm:"primaryKey" json:"id"`
    Title       string     `gorm:"size:255;not null" json:"title"`
    Description string     `gorm:"type:text" json:"description"`
    Status      TaskStatus `gorm:"size:20;not null;default:'todo'" json:"status"`
    Category    string     `gorm:"size:100" json:"category"`
    DueDate     time.Time  `json:"due_date"`
    Color       string     `gorm:"size:50;default:'default'" json:"color"`
    UserID      uint       `json:"user_id"`
    User        User       `gorm:"foreignKey:UserID" json:"-"`
    CreatedAt   time.Time  `json:"created_at"`
    UpdatedAt   time.Time  `json:"updated_at"`
}

type CreateTaskRequest struct {
    Title       string    `json:"title" validate:"required"`
    Description string    `json:"description"`
    Category    string    `json:"category"`
    DueDate     time.Time `json:"due_date"`
    Color       string    `json:"color"`
}

type UpdateTaskRequest struct {
    Title       string     `json:"title"`
    Description string     `json:"description"`
    Status      TaskStatus `json:"status"`
    Category    string     `json:"category"`
    DueDate     time.Time  `json:"due_date"`
    Color       string     `json:"color"`
}
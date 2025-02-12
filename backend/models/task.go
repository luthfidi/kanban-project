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
    DueDate     time.Time  `gorm:"type:timestamptz;not null" json:"due_date"`
    Color       string     `gorm:"size:50;default:'default'" json:"color"`
    UserID      uint       `json:"user_id"`
    User        User       `gorm:"foreignKey:UserID" json:"-"`
    CreatedAt   time.Time  `json:"created_at"`
    UpdatedAt   time.Time  `json:"updated_at"`
}

type CreateTaskRequest struct {
    Title       string    `json:"Title" validate:"required"`
    Description string    `json:"Description"`
    Category    string    `json:"Category"`
    DueDate     time.Time `json:"DueDate"`
    Color       string    `json:"Color"`
}

type UpdateTaskRequest struct {
    Title       string     `json:"Title"`
    Description string     `json:"Description"`
    Status      TaskStatus `json:"Status"`
    Category    string     `json:"Category"`
    DueDate     time.Time  `json:"DueDate"`
    Color       string     `json:"Color"`
}
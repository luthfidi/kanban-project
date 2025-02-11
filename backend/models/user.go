package models

import (
    "time"
)

type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Name      string    `gorm:"size:255;not null" json:"name"`
    Email     string    `gorm:"size:255;not null;unique" json:"email"`
    Password  string    `gorm:"size:255;not null" json:"-"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type UserResponse struct {
    ID    uint   `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func (u *User) ToResponse() UserResponse {
    return UserResponse{
        ID:    u.ID,
        Name:  u.Name,
        Email: u.Email,
    }
}
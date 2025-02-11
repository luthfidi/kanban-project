package utils

import (
    "os"
    "time"
    "github.com/golang-jwt/jwt/v4"
)

type JWTClaim struct {
    UserID uint
    jwt.RegisteredClaims
}

func GenerateToken(userID uint) (string, error) {
    claims := JWTClaim{
        UserID: userID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func ValidateToken(tokenString string) (*JWTClaim, error) {
    token, err := jwt.ParseWithClaims(tokenString, &JWTClaim{}, func(t *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })

    if err != nil {
        return nil, err
    }

    if claims, ok := token.Claims.(*JWTClaim); ok && token.Valid {
        return claims, nil
    }

    return nil, jwt.ErrSignatureInvalid
}
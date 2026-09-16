from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=16, pattern=r"^\+?[0-9]{10,15}$")
    role: Literal["worker", "customer"]
    password: str = Field(min_length=6)
    confirm_password: str = Field(min_length=6)
    skill: str | None = None
    experience: str | None = None
    location: str | None = None

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, value: str):
        if not value.strip():
            raise ValueError("Name cannot be empty")
        return value.strip()

    @model_validator(mode="after")
    def passwords_must_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str = Field(min_length=6)
    confirm_password: str = Field(min_length=6)

    @model_validator(mode="after")
    def passwords_must_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

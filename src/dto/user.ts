export type UserRole = "ADMIN" | "USER" | "INSTRUCTOR";

export interface CreateUserDto {
  username: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface UserDto {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
}

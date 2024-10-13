import { EnumRole } from '@prisma/client'
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class CreateUserDto {
	@IsEmail()
	email: string

	@IsString()
	name: string

	@IsString()
	@IsOptional()
	avatarPath?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsEnum(EnumRole)
	@IsOptional()
	role?: EnumRole

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password: string
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>>

export type UpdateProfileDto = Partial<Omit<CreateUserDto, 'role'>>

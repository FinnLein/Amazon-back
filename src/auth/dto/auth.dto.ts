import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class RegisterDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password: string

	@MinLength(6, {
		message: 'Name must be at least 6 characters long'
	})
	@IsString()
	name: string

	@IsPhoneNumber('RU')
	phone: string
}


export class LoginDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password: string

}



import { IsNotEmpty, IsString } from 'class-validator'

export class CategoryDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	description: string
}

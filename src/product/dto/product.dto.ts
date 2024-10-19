import { Brand } from '@prisma/client'
import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ProductDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	slug: string

	@IsNotEmpty()
	@IsString()
	description?: string

	@IsNotEmpty()
	@IsNumber()
	price: number

	@IsNotEmpty({ each: true })
	@IsString({ each: true })
	@ArrayMinSize(1)
	images: string[]

	category: Category

	brand: Brand
}

export class Category {
	@IsNotEmpty()
	@IsNumber()
	id: number

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	slug: string

	@IsNotEmpty()
	@IsString()
	description: string
}
// reviews: TReview[]
// createdAt: string
// category: TCategory

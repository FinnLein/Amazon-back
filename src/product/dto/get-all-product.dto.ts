import {
	ArrayMinSize,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'
import { PaginationArgsWithSrchTrm } from 'src/pagination/dto/pagination.dto'

export enum EnumProductSort {
	HIGH_PRICE = 'HIGH_PRICE',
	LOW_PRICE = 'LOW_PRICE',
	OLDEST = 'OLDEST',
	NEWEST = 'NEWEST'
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
export class Brand {
	@IsNotEmpty()
	@IsNumber()
	id: number

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	slug: string
}

export class FilterProductDto extends PaginationArgsWithSrchTrm {
	@IsOptional()
	@IsString()
	category?: string

	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort

	@IsOptional()
	@IsString()
	brand?: string

	@IsOptional()
	@IsString()
	minPrice?: string

	@IsOptional()
	@IsString()
	maxPrice?: string

	@IsOptional()
	@IsString()
	rating?: string
}

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

	@IsOptional()
	category?: Category

	@IsOptional()
	brand?: Brand
}

// reviews: TReview[]
// createdAt: string
// category: TCategory

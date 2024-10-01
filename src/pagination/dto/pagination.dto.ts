import { IsEnum, IsOptional, IsString } from 'class-validator'
import { EnumProductSort } from 'src/product/dto/get-all-product.dto'


export class PaginationArgs {
	@IsOptional()
	@IsString()
	skip?: string

	@IsOptional()
	@IsString()
	take?: string
}

export class PaginationArgsWithSearchTerm extends PaginationArgs {
	@IsOptional()
	@IsString()
	searchTerm?: string
}

export class PaginationArgsWithSearchTermAndSort extends PaginationArgsWithSearchTerm {
	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort
}

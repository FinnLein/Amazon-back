import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
	@IsString()
	@IsOptional()
	page?: string

	@IsString()
	@IsOptional()
	perPage?: string
}

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

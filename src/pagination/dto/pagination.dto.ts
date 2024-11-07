import { IsOptional, IsString } from 'class-validator'

export class PaginationArgs {

	@IsOptional()
	@IsString()
	page?: string

	@IsOptional()
	@IsString()
	perPage?: string

}

export class PaginationArgsWithSrchTrm extends PaginationArgs {
	@IsOptional()
	@IsString()
	searchTerm?: string
}

import { IsInt, IsString, Max, Min } from 'class-validator'
import { PaginationArgs } from 'src/pagination/dto/pagination.dto'

export enum ReviewSort {
	OLDEST = 'OLDEST',
	NEWEST = 'NEWEST'
}

export class ReviewDto {
	@IsString()
	text: string

	@IsInt()
	@Min(1)
	@Max(5)
	rating: number
}

export class FilterReviewDto extends PaginationArgs {
	sort?: ReviewSort
}

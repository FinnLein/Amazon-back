import { IsInt, IsString, Max, Min } from 'class-validator'

export class ReviewDto {
	@IsString()
	text: string

	@IsInt()
	@Min(1)
	@Max(5)
	rating: number
}

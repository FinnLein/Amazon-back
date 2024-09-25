import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewDto } from './dto/review.dto'
import { ReviewService } from './review.service'

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get()
	async getAll() {
		return this.reviewService.getAll()
	}

	@Auth()
	@Post('leave/:productId')
	@HttpCode(200)
	async createReview(
		@CurrentUser('id') id: number,
		@Param('productId') productId: string,
		@Body() dto: ReviewDto
	) {
		return this.reviewService.create(id, +productId, dto)
	}

	@Post('average-by-product/:productId')
	async getAverageByProduct(@Param('productId') productId: string) {
		return this.reviewService.getAverageValueByProductId(+productId)
	}
}

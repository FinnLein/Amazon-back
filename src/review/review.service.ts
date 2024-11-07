import { Injectable } from '@nestjs/common'
import { Prisma, Review } from '@prisma/client'
import { isHasMorePagination } from 'src/pagination/is-has-more'
import { PaginationResponse } from 'src/pagination/pagination-response'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'
import { FilterReviewDto, ReviewDto, ReviewSort } from './dto/review.dto'
import { returnReviewObject } from './return-review.object'

@Injectable()
export class ReviewService {
	constructor(
		private prisma: PrismaService,
		private readonly productService: ProductService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(dto: FilterReviewDto = {}): Promise<PaginationResponse<Review>> {
		const { skip, perPage, page } = this.paginationService.getPagination(dto)

		const reviews = await this.prisma.review.findMany({
			select: returnReviewObject,
			orderBy: this._getSortOption(dto.sort),
			skip,
			take: perPage
		})

		const totalCount = await this.prisma.review.count()

		const isHasMore = isHasMorePagination(totalCount, skip, perPage)

		return {
			items: reviews,
			totalCount,
			isHasMore
		}
	}

	_getSortOption(sort: ReviewSort): Prisma.ReviewOrderByWithRelationInput[] {
		switch (sort) {
			case ReviewSort.NEWEST:
				return [{ createdAt: 'desc' }]
			default:
				return [{ createdAt: 'asc' }]
		}
	}
	async create(userId: number, productId: number, dto: ReviewDto) {
		await this.productService.byId(productId)

		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getAverageValueByProductId(productId: number) {
		return this.prisma.review
			.aggregate({
				where: { productId },
				_avg: { rating: true }
			})
			.then(data => data._avg)
	}
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Product } from '@prisma/client'
import { isHasMorePagination } from 'src/pagination/is-has-more'
import { PaginationResponse } from 'src/pagination/pagination-response'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { convertToNumber } from 'src/utils/convert-to-number'
import { generateSlug } from 'src/utils/generate-slug'
import {
	EnumProductSort,
	FilterProductDto,
	ProductDto
} from './dto/get-all-product.dto'
import {
	productReturnObjectFullest,
	returnProductObject
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(
		dto: FilterProductDto = {}
	): Promise<PaginationResponse<Product>> {
		const { skip, perPage, page } = this.paginationService.getPagination(dto)

		const filters = this._createFilter(dto)

		const products = await this.prisma.product.findMany({
			where: filters,
			select: returnProductObject,
			orderBy: this._getSortOption(dto.sort),
			skip,
			take: perPage
		})

		console.log(products)

		if (!products) throw new NotFoundException('There is no products yet')

		const totalCount = await this.prisma.product.count({
			where: filters
		})

		const isHasMore = isHasMorePagination(totalCount, +skip, perPage)

		return { items: products, isHasMore, totalCount }
	}
	private _createFilter(dto: FilterProductDto): Prisma.ProductWhereInput {
		const filters: Prisma.ProductWhereInput[] = []

		if (dto.searchTerm) filters.push(this._getSearchTermFilter(dto.searchTerm))

		if (dto?.brand) {
			filters.push(this._getBrandsFilter(dto?.brand))
		}

		if (dto?.category) {
			filters.push(this._getCategoriesFilter(dto?.category))
		}
		if (dto.rating) filters.push(this._getRating(+dto.rating))

		if (dto.minPrice || dto.maxPrice) {
			filters.push(
				this._getPriceFilter(
					convertToNumber(dto.minPrice),
					convertToNumber(dto.maxPrice)
				)
			)
		}

		return filters.length ? { AND: filters } : {}
	}
	private _getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
		return {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					brand: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				}
			]
		}
	}
	private _getSortOption(
		sort: EnumProductSort
	): Prisma.ProductOrderByWithRelationInput[] {
		switch (sort) {
			case EnumProductSort.LOW_PRICE:
				return [{ price: 'asc' }]
			case EnumProductSort.HIGH_PRICE:
				return [{ price: 'desc' }]
			case EnumProductSort.OLDEST:
				return [{ createdAt: 'asc' }]
			default:
				return [{ createdAt: 'desc' }]
		}
	}
	private _getRating(rating: number): Prisma.ProductWhereInput {
		return {
			rating: {
				gte: rating
			}
		}
	}
	private _getPriceFilter(minPrice?: number, maxPrice?: number) {
		let priceFilter: Prisma.NestedFloatFilter | undefined = undefined

		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}
		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}
		return {
			price: priceFilter
		}
	}
	private _getCategoriesFilter(category?: string): Prisma.ProductWhereInput {
		return {
			category: {
				name: category
			}
		}
	}
	private _getBrandsFilter(brand?: string): Prisma.ProductWhereInput {
		return {
			brand: {
				name: brand
			}
		}
	}
	// Admin

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Product is not found')

		return product
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: returnProductObject
		})

		if (!product) throw new NotFoundException('Product is not found')

		return product
	}

	async byCategory(categorySlug: string) {
		const product = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: productReturnObjectFullest
		})

		if (!product) throw new NotFoundException('Product is not found')

		return product
	}
	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)

		if (!currentProduct)
			throw new NotFoundException('Current product not found')

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: returnProductObject
		})

		return products
	}

	async create(dto: ProductDto) {
		const product = await this.prisma.product.create({
			data: {
				name: dto.name,
				slug: dto.name,
				description: dto.description,
				price: dto.price,
				images: dto.images,
				rating: 0,
				brand: {
					connect: {
						id: dto.brand.id
					}
				},
				category: {
					connect: {
						id: dto.category.id
					}
				}
			}
		})

		return product.id
	}

	async update(id: number, dto: ProductDto) {
		const { description, name, price, category, images, brand } = dto

		return this.prisma.product.update({
			where: {
				id
			},
			data: {
				name,
				description,
				images,
				slug: generateSlug(name),
				price,
				category: {
					connect: {
						id: category.id
					}
				},
				brand: {
					connect: {
						id: brand.id
					}
				}
			}
		})
	}

	async delete(id: number) {
		this.prisma.review.delete({
			where: { id }
		})

		return this.prisma.product.delete({
			where: { id }
		})
	}
}

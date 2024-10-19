import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Product } from '@prisma/client'
import { PaginationArgsWithSearchTermAndSort } from 'src/pagination/dto/pagination.dto'
import { isHasMorePagination } from 'src/pagination/is-has-more'
import { PaginationResponse } from 'src/pagination/pagination-response'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { EnumProductSort } from './dto/get-all-product.dto'
import { ProductDto } from './dto/product.dto'
import {
	productReturnObjectFullest,
	returnProductObject
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAll(
		args?: PaginationArgsWithSearchTermAndSort
	): Promise<PaginationResponse<Product>> {
		const { sort, searchTerm, skip, take } = args

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		if (sort === EnumProductSort.LOW_PRICE) {
			prismaSort.push({ price: 'asc' })
		} else if (sort === EnumProductSort.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' })
		} else if (sort === EnumProductSort.OLDEST) {
			prismaSort.push({ createdAt: 'asc' })
		} else {
			prismaSort.push({ createdAt: 'desc' })
		}

		const searchTermQuery = searchTerm
			? this.getSearchTermFilter(searchTerm)
			: {}

		const products = await this.prisma.product.findMany({
			where: searchTermQuery,
			skip: +skip,
			take: +take,
			select: returnProductObject,
			orderBy: prismaSort
		})

		if (!products) throw new NotFoundException('There is no products yet')

		const totalCount = await this.prisma.product.count({
			where: searchTermQuery
		})

		const isHasMore = isHasMorePagination(totalCount, +skip, +take)

		return { items: products, isHasMore, totalCount }
	}
	private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
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
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
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
				brand: dto.brand,
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
		const { description, name, price, category, images } = dto

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

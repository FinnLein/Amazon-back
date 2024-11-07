import { Prisma } from '.prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Category } from '@prisma/client'
import { PaginationArgsWithSrchTrm } from 'src/pagination/dto/pagination.dto'
import { isHasMorePagination } from 'src/pagination/is-has-more'
import { PaginationResponse } from 'src/pagination/pagination-response'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { CategoryDto } from './src/category/dto/category.dto'
import { returnCategoryObject } from './src/category/return-category.object'

@Injectable()
export class CategoryService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id }
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async bySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			select: returnCategoryObject
		})

		if (!category) throw new NotFoundException('Category not found')

		return category
	}

	async getAll(
		args?: PaginationArgsWithSrchTrm
	): Promise<PaginationResponse<Category>> {
		const { skip, perPage } = this.paginationService.getPagination(args)

		const searchTerm = args?.searchTerm
			? this._getSearchTermFilter(args?.searchTerm)
			: {}

		const categories = await this.prisma.category.findMany({
			where: searchTerm,
			skip,
			take: perPage
		})

		if (!categories) throw new NotFoundException('There is no categories yet')

		const totalCount = await this.prisma.category.count({
			where: searchTerm
		})

		const isHasMore = isHasMorePagination(totalCount, skip, perPage)

		return {
			items: categories,
			isHasMore,
			totalCount
		}
	}

	private _getSearchTermFilter(searchTerm: string): Prisma.CategoryWhereInput {
		return {
			OR: [
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}

	async update(id: number, dto: CategoryDto) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description
			}
		})
	}

	async delete(id: number) {
		return this.prisma.category.delete({
			where: {
				id: id
			}
		})
	}

	async create(dto: CategoryDto) {
		return this.prisma.category.create({
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description
			}
		})
	}
}

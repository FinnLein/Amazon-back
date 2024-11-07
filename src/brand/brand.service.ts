import { Prisma } from '.prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Brand } from '@prisma/client'
import { PaginationArgsWithSrchTrm } from 'src/pagination/dto/pagination.dto'
import { isHasMorePagination } from 'src/pagination/is-has-more'
import { PaginationResponse } from 'src/pagination/pagination-response'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { BrandDto } from './dto/brand.dto'
import { returnBrandObject } from './return-brand.object'

@Injectable()
export class BrandService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async byId(id: number) {
		const brand = await this.prisma.brand.findUnique({
			where: { id }
		})

		if (!brand) throw new NotFoundException('Brand not found')

		return brand
	}

	async bySlug(slug: string) {
		const brand = await this.prisma.brand.findUnique({
			where: { slug },
			select: returnBrandObject
		})
		
		if (!brand) throw new NotFoundException('Brand not found')

		return brand
	}

	async getAll(
		args?: PaginationArgsWithSrchTrm
	): Promise<PaginationResponse<Brand>> {
		const { skip, perPage } = this.paginationService.getPagination(args)

		const searchTerm = args?.searchTerm
			? this._getSearchTermFilter(args?.searchTerm)
			: {}

		const brands = await this.prisma.brand.findMany({
			where: searchTerm,
			skip,
			take: perPage
		})

		if (!brands) throw new NotFoundException('There is no brands yet')

		const totalCount = await this.prisma.brand.count({
			where: searchTerm
		})

		const isHasMore = isHasMorePagination(totalCount, skip, perPage)

		return {
			items: brands,
			isHasMore,
			totalCount
		}
	}

	private _getSearchTermFilter(searchTerm: string): Prisma.BrandWhereInput {
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

	async update(id: number, dto: BrandDto) {
		return this.prisma.brand.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		})
	}

	async delete(id: number) {
		return this.prisma.brand.delete({
			where: {
				id
			}
		})
	}

	async create(dto: BrandDto) {
		return this.prisma.brand.create({
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		})
	}
}

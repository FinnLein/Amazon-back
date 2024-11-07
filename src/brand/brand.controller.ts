import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { PaginationArgsWithSrchTrm } from 'src/pagination/dto/pagination.dto'
import { BrandService } from './brand.service'
import { BrandDto } from './dto/brand.dto'

@Controller('brands')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}

	@Get()
	async getAll(@Query() params?: PaginationArgsWithSrchTrm) {
		return this.brandService.getAll(params)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.brandService.bySlug(slug)
	}

	// Admin

	@Get(':id')
	@Auth([Role.ADMIN])
	async byId(@Param('id') id: string) {
		return this.brandService.byId(+id)
	}

	@HttpCode(200)
	@Auth([Role.ADMIN])
	@Post()
	async create(@Body() dto: BrandDto) {
		return this.brandService.create(dto)
	}

	@HttpCode(200)
	@Auth([Role.ADMIN])
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: BrandDto) {
		return this.brandService.update(+id, dto)
	}

	@HttpCode(200)
	@Auth([Role.ADMIN])
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.brandService.delete(+id)
	}
}

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
import { PaginationArgsWithSearchTerm } from 'src/pagination/dto/pagination.dto'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll(@Query() params?: PaginationArgsWithSearchTerm) {
		return this.categoryService.getAll(params)
	}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	// Admin

	@Get(':id')
	@Auth([Role.ADMIN])
	async byId(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}

	@HttpCode(200)
	@Auth([Role.ADMIN])
	@Post()
	async create(@Body() dto: CategoryDto) {
		return this.categoryService.create(dto)
	}

	@HttpCode(200)
	@Auth([Role.ADMIN])
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+id, dto)
	}

	@HttpCode(200)
	@Auth([Role.ADMIN])
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(+id)
	}
}

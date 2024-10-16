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
	@Auth('ADMIN')
	async byId(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Post()
	async create(@Body() dto: CategoryDto) {
		return this.categoryService.create(dto)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+id, dto)
	}

	@HttpCode(200)
	@Auth('ADMIN')
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(+id)
	}
}

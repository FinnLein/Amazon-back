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
import { PaginationArgsWithSearchTermAndSort } from 'src/pagination/dto/pagination.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAll(@Query() query: PaginationArgsWithSearchTermAndSort) {
		return this.productService.getAll(query)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}
	@Get('by-category/:categorySlug')
	async getByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug)
	}

	// Admin
	@Auth('ADMIN')
	@Get('/:id')
	async getById(@Param('id') id: string) {
		return this.productService.byId(+id)
	}
	@Post()
	@Auth('ADMIN')
	@HttpCode(200)
	async create(@Body() dto: ProductDto) {
		return this.productService.create(dto)
	}

	@Put('/:id')
	@Auth('ADMIN')
	@HttpCode(200)
	async update(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@Delete('/:id')
	@Auth('ADMIN')
	@HttpCode(200)
	async delete(@Param('id') id: string) {
		return this.productService.delete(+id)
	}
}

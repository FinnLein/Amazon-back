import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetAllProductDto } from './dto/get-all-product.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() query: GetAllProductDto) {
		return this.productService.getAll(query)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id)
	}

	@Get('/:id')
	async getById(@Param('id') id: string) {
		return this.productService.byId(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}
	@Get('by-category/:categorySlug')
	async getByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.bySlug(categorySlug)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@Auth()
	@HttpCode(200)
	async create() {
		return this.productService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put('/:id')
	@Auth()
	@HttpCode(200)
	async update(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Delete('/:id')
	@Auth()
	@HttpCode(200)
	async delete(@Param('id') id: string) {
		return this.productService.delete(+id)
	}
}

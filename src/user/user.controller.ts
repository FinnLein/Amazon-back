import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PaginationArgsWithSearchTerm } from 'src/pagination/dto/pagination.dto'
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@HttpCode(200)
	@Put('profile')
	@Auth()
	async updateProfile(
		@CurrentUser('id') id: number,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(id, dto)
	}

	@HttpCode(200)
	@Patch('profile/favorites/:productId')
	@Auth()
	async toggleFavorite(
		@CurrentUser('id') id: number,
		@Param('productId') productId: string
	) {
		return this.userService.toggleFavorites(id, +productId)
	}

	// Admin

	@Auth('ADMIN')
	@Get()
	async getAllUsers(@Query() params: PaginationArgsWithSearchTerm) {
		return this.userService.getAllUsers(params)
	}

	@Auth('ADMIN')
	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.userService.byId(+id)
	}
	@Auth('ADMIN')
	@Post()
	async create(@Body() dto: CreateUserDto) {
		return this.userService.create(dto)
	}
	@Auth('ADMIN')
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async update(@Body() dto: UpdateUserDto, @Param('id') id: string) {
		return this.userService.update(+id, dto)
	}
	@Auth('ADMIN')
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.userService.delete(+id)
	}
}

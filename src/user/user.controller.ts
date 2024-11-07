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
	Query
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PaginationArgsWithSrchTrm } from 'src/pagination/dto/pagination.dto'
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('by-email/:email')
	@Auth()
	async getByEmail(@Param('email') email: string) {
		return this.userService.findByEmail(email)
	}
	@Get('profile')
	@Auth(Role.USER)
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.byId(+id)
	}
	@HttpCode(200)
	@Put('profile')
	@Auth(Role.USER)
	async updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(+id, dto)
	}

	@HttpCode(200)
	@Patch('profile-avatar')
	@Auth(Role.USER)
	async updateProfileAvatar(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfileAvatar(+id, dto)
	}

	@HttpCode(200)
	@Patch('profile/favorites/:productId')
	@Auth(Role.USER)
	async toggleFavorite(
		@CurrentUser('id') id: string,
		@Param('productId') productId: string
	) {
		return this.userService.toggleFavorites(+id, +productId)
	}

	// Admin

	@Auth(Role.ADMIN)
	@Get()
	async getAllUsers(@Query() query: PaginationArgsWithSrchTrm) {
		return this.userService.getAllUsers(query)
	}

	@Auth(Role.ADMIN)
	@Get(':id')
	async byId(@Param('id') id: string) {
		return this.userService.byId(+id)
	}

	@Auth(Role.ADMIN)
	@Post()
	async create(@Body() dto: CreateUserDto) {
		return this.userService.create(dto)
	}
	@Auth(Role.USER)
	@Put(':id')
	async update(@Body() dto: UpdateUserDto, @Param('id') id: string) {
		return this.userService.update(+id, dto)
	}
	@Auth(Role.ADMIN)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.userService.delete(+id)
	}
}

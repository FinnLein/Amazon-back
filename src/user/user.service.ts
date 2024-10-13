import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { hash } from 'argon2'
import {
	IGithubProfile,
	IGoogleProfile
} from 'src/auth/social-media/social-media.types'
import { PaginationArgsWithSearchTerm } from 'src/pagination/dto/pagination.dto'
import { isHasMorePagination } from 'src/pagination/is-has-more'
import { PaginationResponse } from 'src/pagination/pagination-response'
import { PrismaService } from 'src/prisma.service'
import {
	CreateUserDto,
	UpdateProfileDto,
	UpdateUserDto
} from './dto/createUser.dto'
import { returnUserObject } from './return-user.object'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAllUsers(
		args?: PaginationArgsWithSearchTerm
	): Promise<PaginationResponse<User>> {
		const searchTermQuery = args?.searchTerm
			? this.getSearchTermFilter(args?.searchTerm)
			: {}

		const users = await this.prisma.user.findMany({
			skip: +args?.skip,
			take: +args?.take,
			where: searchTermQuery
		})

		if (!users) throw new NotFoundException('There is no users yet')

		const totalCount = await this.prisma.user.count({
			where: searchTermQuery
		})

		const isHasMore = isHasMorePagination(totalCount, +args?.skip, +args?.take)

		return { items: users, isHasMore, totalCount }
	}
	private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
		return {
			OR: [
				{
					email: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}
	async findByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			}
		})

		if (!user) throw new NotFoundException('User with this email doesnt exist')

		return user
	}
	async toggleFavorites(id: number, productId: number) {
		const user = await this.byId(id)

		if (!user) throw new NotFoundException('Not found user')

		const isExists = user.favorites.some(product => product.id === productId)

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		})

		return { message: 'Success' }
	}
	async updateProfile(id: number, dto: UpdateProfileDto) {
		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				password: await hash(dto.password)
			}
		})
	}
	async updateProfileAvatar(id: number, dto: UpdateProfileDto) {
		return this.prisma.user.update({
			where: { id },
			data: {
				avatarPath: dto.avatarPath
			}
		})
	}

	async findOrCreateBySocial(profile: IGoogleProfile | IGithubProfile) {
		let user = await this.findByEmail(profile.email)

		if (!user) {
			user = await this._createBySocial(profile)
		}

		return user
	}

	async _createBySocial(
		profile: IGoogleProfile | IGithubProfile
	): Promise<User> {
		const email = profile.email
		const picture = profile.picture || ''
		const name =
			'firstName' in profile
				? `${profile.firstName} ${profile.lastName}`
				: profile.username

		return this.prisma.user.create({
			data: {
				email,
				avatarPath: picture,
				name,
				password: '',
				verificationToken: null
			}
		})
	}

	// Admin
	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true,
						category: {
							select: {
								slug: true
							}
						},
						reviews: true
					}
				},
				...selectObject
			}
		})

		if (!user) throw new NotFoundException('User is not found')

		return user
	}
	async create({ password, ...dto }: CreateUserDto) {
		const user = {
			...dto,
			password: await hash(password)
		}

		return this.prisma.user.create({
			data: user
		})
	}
	async update(id: number, dto: UpdateUserDto) {
		const isSameUser = await this.byId(id)

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Email already exist')

		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				role: dto.role
			}
		})
	}
	async delete(id: number) {
		return this.prisma.user.delete({ where: { id } })
	}
}

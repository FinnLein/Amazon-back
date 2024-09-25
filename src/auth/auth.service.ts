import { faker } from '@faker-js/faker'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EnumRole, User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN = 'refreshToken'

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private userService: UserService
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.findByEmail(dto.email)

		if (oldUser) throw new BadRequestException('This user already exist')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.person.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number('+7 (###) ###-##-##'),
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: await this.getUsersField(user),
			...tokens
		}
	}
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id, user.role)

		return { user: await this.getUsersField(user), ...tokens }
	}
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.byId(result.id)

		const tokens = await this.issueTokens(user.id)

		return {
			...tokens,
			user: await this.getUsersField(user)
		}
	}
	private async issueTokens(userId: number, role?: EnumRole) {
		const data = { id: userId, role }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresIn,
			// true if production
			secure: true,
			// lax if prod
			sameSite: true
		})
	}
	removeRefreshTokenToResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			// true if production
			secure: true,
			// lax if prod
			sameSite: true
		})
	}
	private async validateUser(dto: AuthDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user) throw new NotFoundException('User is not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}
	private async getUsersField(user: User) {
		return {
			id: user.id,
			email: user.email,
			role: user.role
		}
	}
}

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role, User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private userService: UserService
	) {}

	private readonly TOKEN_EXPIRATION_ACCESS = '24h'
	private readonly TOKEN_EXPIRATION_REFRESH = '30d'

	async register(dto: RegisterDto) {
		const oldUser = await this.userService.findByEmail(dto.email)

		if (oldUser) throw new BadRequestException('This user already exist')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: '/uploads/default-avatar.png',
				phone: dto.phone,
				password: await hash(dto.password),
				rights: [Role.USER]
			}
		})

		const tokens = await this.issueTokens(user.id, user.rights)

		// await this.emailService.sendWelcome(user.email)

		return {
			user: await this.getUsersField(user),
			...tokens
		}
	}
	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id, user.rights)

		return { user: await this.getUsersField(user), ...tokens }
	}
	async verifyEmail(token: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				verificationToken: token
			}
		})
		if (!user) throw new NotFoundException('Token not exists')

		await this.userService.update(user.id, { verificationToken: null })

		return 'Email verified'
	}
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.byId(result.id)

		const tokens = await this.issueTokens(user.id, user.rights)

		return {
			...tokens,
			user: await this.getUsersField(user)
		}
	}
	private async issueTokens(userId: number, rights: Role[]) {
		const data = { id: userId, rights }

		const accessToken = this.jwt.sign(data, {
			expiresIn: this.TOKEN_EXPIRATION_ACCESS
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: this.TOKEN_EXPIRATION_REFRESH
		})

		return { accessToken, refreshToken }
	}
	async buildResponseObject(user: User) {
		const tokens = await this.issueTokens(user.id, user.rights)
		return { user: this.getUsersField(user), ...tokens }
	}
	private async validateUser(dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user) throw new NotFoundException('Email or password invalid')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Email or password invalid')

		return user
	}

	private async getUsersField(user: User) {
		return {
			id: user.id,
			email: user.email,
			rights: user.rights
		}
	}
}

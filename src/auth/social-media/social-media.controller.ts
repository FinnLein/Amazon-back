import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './social-media.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: RegisterDto,
		@Res({ passthrough: true }) res: Response
	) {
		const response = await this.authService.register(dto)

		this.authService.addRefreshTokenToResponse(res, response.refreshToken)

		return response
	}

	@HttpCode(200)
	@Post('login')
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response
	) {
		const response = await this.authService.login(dto)

		this.authService.addRefreshTokenToResponse(res, response.refreshToken)

		return response
	}
	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenFromResponse(res)
		return true
	}

	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const response = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)

		this.authService.addRefreshTokenToResponse(res, response.refreshToken)

		return response
	}
}

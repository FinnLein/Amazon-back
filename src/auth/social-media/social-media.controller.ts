import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { RefreshTokenService } from '../refresh-token.service'
import { AuthService } from './../auth.service'
import { SocialMediaService } from './social-media.service'
import { TProfileSocial } from './social-media.types'

@Controller('auth')
export class SocialMediaController {
	constructor(
		private readonly socialMediaService: SocialMediaService,
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService
	) {}

	_CLIENT_BASE_URL = 'http://localhost:3000/social-auth?accessToken='

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	@Get('google/redirect')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(
		@Req() req: { user: TProfileSocial },
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.socialMediaService.login(req)
		const { accessToken, refreshToken } =
			await this.authService.buildResponseObject(user)
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)

		return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`)
	}

	@Get('github')
	@UseGuards(AuthGuard('github'))
	async githubAuth() {}

	@Get('github/redirect')
	@UseGuards(AuthGuard('github'))
	async githubAuthRedirect(
		@Req() req: { user: TProfileSocial },
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.socialMediaService.login(req)
		const { accessToken, refreshToken } =
			await this.authService.buildResponseObject(user)
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)

		return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`)
	}
}

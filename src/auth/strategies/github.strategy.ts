import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-github2'
import { VerifiedCallback } from 'passport-jwt'
import { IGithubProfile } from '../social-media/social-media.types'
import { AuthService } from './../auth.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService
	) {
		super({
			clientID: configService.get('GITHUB_CLIENT_ID'),
			clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
			callbackUrl: configService.get('GITHUB_CALLBACK_URL'),
			scope: ['user:email']
		})
	}

	async validate(
		done: VerifiedCallback,
		accessToken: string,
		refreshToken: string,
		profile: any
	): Promise<any> {
		const { username, emails, photos } = profile
		const user: IGithubProfile = {
			email: emails[0].value,
			username,
			picture: photos[0].value,
			accessToken
		}
		done(null, user)
	}
}

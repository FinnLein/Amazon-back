import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import {} from 'passport-jwt'
import { IGoogleProfile } from '../social-media/social-media.types'
import { AuthService } from './../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService
	) {
		super({
			clientID: configService.get('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
			callbackUrl: configService.get('GOOGLE_CALLBACK_URL'),
			scope: ['email', 'profile']
		})
	}

	async validate(
		done: VerifyCallback,
		accessToken: string,
		refreshToken: string,
		profile: any
	): Promise<any> {
		const { name, emails, photos } = profile
		const user: IGoogleProfile = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken
		}
		done(null, user)
	}
}

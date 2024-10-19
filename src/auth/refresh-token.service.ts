import { Injectable } from '@nestjs/common'
import type { Response } from 'express'

@Injectable()
export class RefreshTokenService {
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN = 'refreshToken'

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			domain: 'localhost',
			expires: expiresIn,
			// true if production
			secure: true,
			// lax if production
			sameSite: 'none'
		})

		return res
	}
	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN, '', {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(0),
			// true if production
			secure: true,
			// lax if production
			sameSite: 'none'
		})
	}
}

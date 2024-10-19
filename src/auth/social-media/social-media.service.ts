import { BadRequestException, Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { TProfileSocial } from './social-media.types'

@Injectable()
export class SocialMediaService {
	constructor(private userService: UserService) {}

	async login(req: { user: TProfileSocial }) {
		if (!req.user) {
			throw new BadRequestException('User not found by social')
		}

		return this.userService.findOrCreateBySocial(req.user)
	}
}

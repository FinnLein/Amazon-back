import { User } from '@prisma/client'

export class UserResponse {
	items: User[]
	isHasMore: boolean
	totalCount: number
}

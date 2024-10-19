import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	avatarPath: true,
	password: true,
	phone: true,
	rights: true,
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
	}
}

import { Prisma } from '@prisma/client'

export const returnReviewObject: Prisma.ReviewSelect = {
	user: {
		select: {
			id: true,
			name: true
		}
	},
	id: true,
	createdAt: true,
	text: true,
	rating: true
}

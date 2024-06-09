import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/return-category.object'
import { returnReviewObject } from 'src/review/return-review.object'

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	name: true,
	slug: true,
	description: true,
	price: true,
	images: true,
	createdAt: true
}

export const returnProductObjectFull: Prisma.ProductSelect = {
	...returnProductObject,
	reviews: {
		select: returnReviewObject
	},
	category: {
		select: returnCategoryObject
	}
}

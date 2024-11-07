import { Prisma } from '@prisma/client'
import { returnBrandObject } from 'src/brand/return-brand.object'
import { returnCategoryObject } from 'src/category/return-category.object'
import { returnReviewObject } from 'src/review/return-review.object'

export const returnProductObject: Prisma.ProductSelect = {
	images: true,
	description: true,
	id: true,
	name: true,
	price: true,
	createdAt: true,
	slug: true,
	rating: true,
	category: { select: returnCategoryObject },
	brand: { select: returnBrandObject },
	reviews: {
		select: returnReviewObject
	}
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
	...returnProductObject
}

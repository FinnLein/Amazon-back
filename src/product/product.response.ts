import { Product } from '@prisma/client'

export class ProductResponse {
	items: Product[]
	isHasMore: boolean
	totalCount: number
}

export class PaginationResponse<T> {
	items: T[]
	isHasMore: boolean
	totalCount: number
}

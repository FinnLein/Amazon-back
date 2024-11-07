import { Injectable } from '@nestjs/common'
import { PaginationArgs } from './dto/pagination.dto'

@Injectable()
export class PaginationService {
	getPagination(dto: PaginationArgs, defaultPerPage = 4) {
		const page = dto.page ? +dto.page : 1
		const perPage = dto.perPage ? +dto.perPage : defaultPerPage

		const skip = (page - 1) * perPage

		return { page, perPage, skip }
	}
}

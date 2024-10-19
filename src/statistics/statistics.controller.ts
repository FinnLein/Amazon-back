import { Controller, Get } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('/main')
	@Auth()
	async getStatistics(@CurrentUser('id') id: number) {
		return this.statisticsService.getMain(id)
	}

	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/best-selling-products')
	async getBestSellingProduct() {
		return this.statisticsService.getBestSellingProduct()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/most-unsold-products')
	async getMostUnsoldProduct() {
		return this.statisticsService.getMostUnsoldProduct()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/most-expensive-products')
	async getMostExpensiveProducts() {
		return this.statisticsService.getMostExpensiveProducts()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/most-chippiest-products')
	async getMostChippiesProducts() {
		return this.statisticsService.getMostChippiesProducts()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/users-count')
	async getUsersCount() {
		return this.statisticsService.getUsersCount()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/products-count')
	async getProductsCount() {
		return this.statisticsService.getProductsCount()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/registration-by-month')
	async getUsersRegistrationByMonths() {
		return this.statisticsService.getUsersRegistrationByMonths()
	}
	@Auth([Role.ADMIN, Role.MANAGER])
	@Get('/most-expensive-products/by-category')
	async getMostExpensiveProductsByCategory() {
		return this.statisticsService.getMostExpensiveProductsByCategory()
	}
}

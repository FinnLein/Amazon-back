import { Controller, Get } from '@nestjs/common'
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

	@Auth()
	@Get('/best-selling-products')
	async getBestSellingProduct() {
		return this.statisticsService.getBestSellingProduct()
	}
	@Auth()
	@Get('/most-unsold-products')
	async getMostUnsoldProduct() {
		return this.statisticsService.getMostUnsoldProduct()
	}
	@Auth()
	@Get('/most-expensive-products')
	async getMostExpensiveProducts() {
		return this.statisticsService.getMostExpensiveProducts()
	}
	@Auth()
	@Get('/most-chippiest-products')
	async getMostChippiesProducts() {
		return this.statisticsService.getMostChippiesProducts()
	}

	@Auth()
	@Get('/users-count')
	async getUsersCount() {
		return this.statisticsService.getUsersCount()
	}

	@Auth()
	@Get('/registration-by-month')
	async getUsersRegistrationByMonths() {
		return this.statisticsService.getUsersRegistrationByMonths()
	}
	@Auth()
	@Get('/most-expensive-products/by-category')
	async getMostExpensiveProductsByCategory() {
		return this.statisticsService.getMostExpensiveProductsByCategory()
	}
}

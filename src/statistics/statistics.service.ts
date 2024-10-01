import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class StatisticsService {
	constructor(
		private userService: UserService,
		private prisma: PrismaService
	) {}

	async getMain(userId: number) {
		const user = await this.userService.byId(userId, {
			orders: {
				select: {
					items: true
				}
			},
			reviews: true
		})

		const amount = await this.prisma.order.aggregate({
			where: {
				userId
			},
			_sum: {
				total: true
			}
		})

		return [
			{
				name: 'Orders',
				value: user.orders.length
			},
			{
				name: 'Reviews',
				value: user.reviews.length
			},
			{
				name: 'Favorites',
				value: user.favorites.length
			},
			{
				name: 'Amount',
				value: amount
			}
		]
	}
	async getBestSellingProduct() {
		const result = await this.prisma.orderItem.groupBy({
			by: ['productId'],
			_sum: {
				quantity: true
			},
			orderBy: {
				_sum: {
					quantity: 'desc'
				}
			},
			take: 10
		})

		const productsIds = result.map(item => item.productId)

		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: productsIds
				}
			}
		})

		const bestSellers = result.map(item => {
			const product = products.find(p => p.id === item.productId)
			return {
				productId: item.productId,
				name: product.name,
				slug: product.slug,
				productPrice: product.price,
				totalQuantitySold: item._sum.quantity,
				totalPriceSold: item._sum.quantity * product.price
			}
		})

		return bestSellers
	}
	async getMostUnsoldProduct() {
		const result = await this.prisma.orderItem.groupBy({
			by: ['productId'],
			_sum: {
				quantity: true
			},
			orderBy: {
				_sum: {
					quantity: 'asc'
				}
			},
			take: 10
		})

		const productsIds = result.map(item => item.productId)

		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: productsIds
				}
			}
		})

		const mostUnsoldProduct = result.map(item => {
			const product = products.find(p => p.id === item.productId)
			return {
				productId: item.productId,
				name: product.name,
				slug: product.slug,
				productPrice: product.price,
				totalQuantitySold: item._sum.quantity,
				totalPriceSold: item._sum.quantity * product.price
			}
		})

		return mostUnsoldProduct
	}
	async getMostExpensiveProducts() {
		const result = await this.prisma.product.findMany({
			orderBy: {
				price: 'desc'
			},
			take: 5
		})

		const mostExpensiveProducts = result.map(i => {
			return {
				id: i.id,
				images: i.images,
				name: i.name,
				slug: i.slug,
				price: i.price
			}
		})

		return mostExpensiveProducts
	}
	async getMostChippiesProducts() {
		const result = await this.prisma.product.findMany({
			orderBy: {
				price: 'asc'
			},
			take: 5
		})

		const mostChippiesProducts = result.map(p => {
			return {
				id: p.id,
				images: p.images,
				name: p.name,
				slug: p.slug,
				price: p.price
			}
		})

		return mostChippiesProducts
	}
	async getUsersCount() {
		const usersCount = await this.prisma.user.count()

		const activeUsersCount = await this.prisma.user.count({
			where: {
				updatedAt: {
					gte: new Date(new Date().setDate(new Date().getDate() - 30))
				}
			}
		})
		const newUsersCount = await this.prisma.user.count({
			where: {
				createdAt: {
					gte: new Date(new Date().setDate(new Date().getDate() - 30))
				}
			}
		})

		return [
			{
				name: 'Users',
				value: usersCount
			},
			{
				name: 'Fresh users',
				value: activeUsersCount
			},
			{
				name: 'New users',
				value: newUsersCount
			}
		]
	}
	async getUsersRegistrationByMonths() {
		const currentMonth = new Date().getMonth()
		const currentYear = new Date().getFullYear()

		// начало отсчётного периода: сентябрь прошлого года
		const startDate = new Date(currentYear - 1, currentMonth + 1, 1)

		// конец отсчётного периода: последний день текущео месяца
		const endDate = new Date(currentYear, currentMonth + 1, 0)

		const allMonths = this.generateMonths(startDate, endDate)

		const registrations = await this.prisma.user.groupBy({
			by: ['createdAt'],
			_count: true,
			orderBy: {
				createdAt: 'asc'
			},
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate
				}
			}
		})

		const registrationMap = new Map<string, number>()

		for (const reg of registrations) {
			const month = reg.createdAt.getMonth() + 1
			const year = reg.createdAt.getFullYear()
			const key = `${year}-${month}`

			if (registrationMap.has(key)) {
				registrationMap.set(key, registrationMap.get(key) + reg._count)
			} else {
				registrationMap.set(key, reg._count)
			}
		}

		return allMonths.map(({ month, year }) => {
			const key = `${year}-${month}`
			const monthName = dayjs(new Date(year, month - 1)).format('MMMM')

			return {
				month: monthName,
				year,
				count: registrationMap.get(key) || 0
			}
		})
	}

	private generateMonths(start: Date, end: Date) {
		const current = new Date(start)
		const last = new Date(end)
		const months = []

		while (current < last) {
			months.push({
				month: current.getMonth() + 1,
				year: current.getFullYear()
			})
			current.setMonth(current.getMonth() + 1)
		}

		months.push({
			month: current.getMonth() + 1,
			year: current.getFullYear()
		})

		return months
	}
}

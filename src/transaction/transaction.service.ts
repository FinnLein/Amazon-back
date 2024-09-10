import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { YookassaService } from 'src/yookassa/yookassa.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { YookassaPaymentResponse } from './response/payment-response'

@Injectable()
export class TransactionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly yookassa: YookassaService
	) {}

	async makePayment(
		user: User,
		orderId: number
	): Promise<YookassaPaymentResponse> {
		const order = await this.prisma.order.findUnique({
			where: {
				id: orderId
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		if (!order) throw new Error('Order not found')

		const price = order.items.reduce((total, item) => {
			return total + item.quantity * item.product.price
		}, 0)

		const payment = await this.makeYookassaPayment(user, price, order.id)

		return { confirmationToken: payment.confirmation.confirmation_token }
	}
	async makeYookassaPayment(user: User, price: number, orderId: number) {
		try {
			const paymentResponse = await this.yookassa.createPayment({
				currency: 'RUB',
				customerEmail: user.email,
				items: [
					{
						description: `Заказ №${orderId}`,
						quantity: '1.00',
						amount: {
							value: price.toString(),
							currency: 'RUB'
						},
						vat_code: '1'
					}
				],
				total: price.toString()
			})
			if (paymentResponse) {
				await this.create({
					userId: user.id,
					payment: paymentResponse
				})
			}
			return paymentResponse
		} catch (error) {
			console.log('make russian payment error', error)
			throw new BadRequestException('Ошибка при создании платежа')
		}
	}

	async create({ userId, payment }: CreateTransactionDto) {
		return this.prisma.order.create({
			data: {
				total: +payment.amount.value,
				paymentId: payment.id,
				status: payment.status,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}
	async update({ transactionId, payment }: UpdateTransactionDto) {
		const paymentData = payment
			? {
					amount: payment.amount.value,
					paymentId: payment.id,
					paymentMethod: payment.payment_method.type,
					status: payment.status
				}
			: {}

		return this.prisma.order.update({
			where: {
				id: transactionId
			},
			data: {
				...paymentData
			}
		})
	}
}

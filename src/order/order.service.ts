import { Injectable } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { returnProductObject } from 'src/product/return-product.object'
import { CurrencyEnum } from 'yookassa-ts/lib/types/Common'
import { PaymentMethodsEnum } from 'yookassa-ts/lib/types/PaymentMethod'
import YooKassa from 'yookassa-ts/lib/yookassa'
import { OrderDto } from './dto/order.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'

const yooKassa = new YooKassa({
	shopId: process.env['SHOP_ID'],
	secretKey: process.env['PAYMENT_TOKEN']
})

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}
	async getAll(userId: number) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnProductObject
						}
					}
				}
			}
		})
	}
	async placeOrder(dto: OrderDto, userId: number) {
		const total = dto.items.reduce((acc, item) => {
			return acc + item.price * item.quantity
		}, 0)

		const order = await this.prisma.order.create({
			data: {
				status: dto.status,
				items: {
					create: dto.items
				},
				total,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		const payment = await yooKassa.createPayment({
			amount: {
				value: total.toFixed(2),
				currency: CurrencyEnum.RUB
			},
			payment_method_data: {
				type: PaymentMethodsEnum.bank_card
			},
			// @ts-ignore
			confirmation: {
				type: 'redirect',
				return_url: 'http://localhost:3000/thanks'
			},
			/* CHANGE */
			description: `Order #${order.id}`
		})

		return payment
	}

	async updateStatus(dto: PaymentStatusDto) {
		if (dto.event === 'payment.waiting_for_capture') {
			const payment = await yooKassa.capturePayment(dto.object.id, dto.object.amount)
			return payment
		}
		if (dto.event === 'payment.succeeded') {
			const orderId = Number(dto.object.description.split('#')[1])

			await this.prisma.order.update({
				where: {
					id: orderId
				},
				data: {
					status: EnumOrderStatus.PAYED
				}
			})

			return true
		}

		return true
	}
}

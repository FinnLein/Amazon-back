import { Injectable, NotFoundException } from '@nestjs/common'
import { PaymentStatusDto } from 'src/order/dto/payment-status.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class WebhookService {
	constructor(private readonly prisma: PrismaService) {}

	async yookAssa(dto: PaymentStatusDto) {
		const { object } = dto

		const order = await this.prisma.order.findUnique({
			where: {
				id: +object.id
			},
			include: {
				user: true
			}
		})

		if (!order) {
			throw new NotFoundException('Order not found')
		}
		if (dto.event === 'payment.succeeded') {
			await this.prisma.order.update({
				where: {
					id: order.id
				},
				data: {
					status: object.status,
					paymentMethod: object.payment_method.type
				}
			})
		}
	}
}

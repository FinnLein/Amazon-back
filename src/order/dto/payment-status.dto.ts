import { EnumOrderStatus } from '@prisma/client'
import { CurrencyEnum } from 'yookassa-ts/lib/types/Common'

class ObjectPayment {
	id: string
	status: EnumOrderStatus
	amount: {
		value: string
		currency: CurrencyEnum
	}
	payment_method: {
		type: string
		id: number
		saved: boolean
		title: string
		card: object
	}
	createdAt: string
	expiresAt: string
	description: string
}

export class PaymentStatusDto {
	event:
		| 'payment.succeeded'
		| 'payment.waiting_for_capture'
		| 'payment.canceled'
		| 'refund.succeeded'
	type: string
	object: ObjectPayment
}

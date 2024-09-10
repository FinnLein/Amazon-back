import { EnumOrderStatus } from '@prisma/client'
import { AmountPayment } from '../dto/yookassa.dto'
import { IReceipt } from '../types/receipt.types'

export class ObjectPayment {
	id: string
	status: EnumOrderStatus
	amount: AmountPayment
	confirmation: {
		type: 'embedded'
		confirmation_token: string
	}
	payment_method: {
		type: string
		id: string
		saved: boolean
		title: string
		card: object
	}
	created_at: string
	updated_at: string
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

export declare enum PaymentStatusEnum {
	PENDING = 'pending',
	WAITING_FOR_CAPTURE = 'waiting_for_capture',
	SUCCEDED = 'succeeded',
	CANCELED = 'canceled'
}

export interface IConfirmationEmbedded {
	type: 'embedded'
	locale?: LocaleEnum
}
export interface ICreatePaymentRequest {
	amount: AmountPayment
	receipt?: IReceipt
	recipient?: {
		gateway_id: string
	}
	payment_method_data?: 'bank_card'
	payment_method_id?: string
	capture: boolean
	description: string
	confirmation?: IConfirmationEmbedded
	save_payment_method?: boolean
	merchant_customer_id?: string
}

export enum LocaleEnum {
	ru_Ru = 'ru_Ru',
	en_Us = 'en_Us'
}

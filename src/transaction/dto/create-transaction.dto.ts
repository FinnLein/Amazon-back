import { IsNumber } from 'class-validator'
import { ObjectPayment } from 'src/yookassa/types/yookassa.types'

export class CreateTransactionDto {

	@IsNumber()
	userId: number

	payment: ObjectPayment
}

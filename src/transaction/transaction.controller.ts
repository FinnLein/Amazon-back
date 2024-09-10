import { Body, Controller, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { TransactionService } from './transaction.service'

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post('make-payment')
	@Auth()
	async makePyement(@Body() orderId: number, @CurrentUser() user: User) {
		return this.transactionService.makePayment(user, orderId)
	}
}

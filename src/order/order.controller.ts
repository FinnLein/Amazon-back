import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { OrderDto } from './dto/order.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth()
	getAll(@CurrentUser('id') userId: number) {
		return this.orderService.getAll(userId)
	}

	@Get('get-last')
	@Auth()
	getLast(@CurrentUser('id') userId: number) {
		return this.orderService.getLast(userId)
	}

	@HttpCode(200)
	@Post()
	@Auth()
	placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
		return this.orderService.placeOrder(dto, userId)
	}

	@HttpCode(200)
	@Post('status')
	updateStatus(@Body() dto: PaymentStatusDto) {
		return this.orderService.updateStatus(dto)
	}

	@Auth(Role.ADMIN)
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.orderService.delete(+id)
	}
}

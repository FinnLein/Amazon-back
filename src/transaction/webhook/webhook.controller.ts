import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { PaymentStatusDto } from 'src/order/dto/payment-status.dto'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}

	@HttpCode(200)
	@Post()
	async webhook(@Body() dto: PaymentStatusDto) {
		return this.webhookService.yookAssa(dto)
	}
}

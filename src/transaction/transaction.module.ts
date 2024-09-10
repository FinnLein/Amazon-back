import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from 'src/prisma.service'
import { YookassaService } from 'src/yookassa/yookassa.service'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { WebhookService } from './webhook/webhook.service'

@Module({
	imports: [HttpModule, ConfigModule],
	controllers: [TransactionController],
	providers: [
		TransactionService,
		PrismaService,
		YookassaService,
		WebhookService
	]
})
export class TransactionModule {}

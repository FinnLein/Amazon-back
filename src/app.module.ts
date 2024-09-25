import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { PaginationModule } from './pagination/pagination.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { StatisticsModule } from './statistics/statistics.module'
import { UserModule } from './user/user.module'
import { YookassaModule } from './yookassa/yookassa.module'
import { SettingsModule } from './settings/settings.module';
import { EmailModule } from './email/email.module';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true	
		}),
		AuthModule,
		UserModule,
		ProductModule,
		ReviewModule,
		CategoryModule,
		OrderModule,
		StatisticsModule,
		PaginationModule,
		YookassaModule,
		SettingsModule,
		EmailModule
	]
})
export class AppModule {}

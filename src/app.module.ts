import { Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config'
import { MediaModule } from './media/media.module'
import { OrderModule } from './order/order.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { SettingsModule } from './settings/settings.module'
import { StatisticsModule } from './statistics/statistics.module'
import { UserModule } from './user/user.module'
import { YookassaModule } from './yookassa/yookassa.module'
import { BrandModule } from './brand/brand.module'
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getGoogleRecaptchaConfig,
			inject: [ConfigService]
		}),
		AuthModule,
		UserModule,
		ProductModule,
		ReviewModule,
		CategoryModule,
		OrderModule,
		StatisticsModule,
		YookassaModule,
		SettingsModule,
		MediaModule,
		BrandModule
	]
})
export class AppModule {}

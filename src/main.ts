import { NestFactory } from '@nestjs/core'
import * as CookieParser from 'cookie-parser'
import { AppModule } from './app.module'
async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	app.setGlobalPrefix('api')
	app.enableCors({
		origin: ['http://localhost:3000'],
		credentials: true
	})
	app.use(CookieParser())
	await app.listen(4200)
}
bootstrap()

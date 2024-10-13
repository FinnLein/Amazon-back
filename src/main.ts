import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as CookieParser from 'cookie-parser'
import { AppModule } from './app.module'
async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	app.setGlobalPrefix('api', {
		exclude: [
			{ path: 'auth/google', method: RequestMethod.GET },
			{ path: 'auth/github/redirect', method: RequestMethod.GET },
			{ path: 'auth/google', method: RequestMethod.GET },
			{ path: 'auth/github/redirect', method: RequestMethod.GET }
		]
	})
	app.use(CookieParser())
	app.enableCors({
		origin: ['http://localhost:3000'],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(4200)
}
bootstrap()

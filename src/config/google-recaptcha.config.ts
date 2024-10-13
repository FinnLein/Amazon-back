import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'
import { isDev } from 'src/utils/is-dev.util'

export const getGoogleRecaptchaConfig = async (
	config: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => ({
	secretKey: config.get<string>('RECAPTCHA_SECRET_KEY'),
	response: req => req.headers.recaptcha,
	skipIf: isDev(config)
})

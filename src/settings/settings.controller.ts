import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { SettingsService } from './settings.service'

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Auth(Role.ADMIN)
	@Get(':key')
	get(@Param('key') key: string) {
		return this.settingsService.getByKey(key)
	}

	@Auth(Role.ADMIN)
	@Post()
	set(@Body() settingData: { key: string; value: string }) {
		return this.settingsService.set(settingData.key, settingData.value)
	}
}

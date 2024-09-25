import { Injectable, NotFoundException } from '@nestjs/common'
import { Setting } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class SettingsService {
	constructor(private readonly prisma: PrismaService) {}

	async getByKey(key: string): Promise<Setting> | null {
		const setting = await this.prisma.setting.findUnique({
			where: {
				key
			}
		})

		if (!setting) throw new NotFoundException('Setting not found')

		return setting
	}

	async set(key: string, value: string): Promise<Setting> {
		return this.prisma.setting.upsert({
			where: { key },
			update: { value },
			create: { key, value }
		})
	}
}

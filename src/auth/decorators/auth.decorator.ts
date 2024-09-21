import { applyDecorators, UseGuards } from '@nestjs/common'
import { EnumRole } from '@prisma/client'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { JWTAuthGuard } from '../guards/jwt.guard'

export const Auth = (role: EnumRole = EnumRole.USER) => {
	if (role === EnumRole.ADMIN) {
		return applyDecorators(UseGuards(JWTAuthGuard, OnlyAdminGuard))
	}

	return applyDecorators(UseGuards(JWTAuthGuard))
}

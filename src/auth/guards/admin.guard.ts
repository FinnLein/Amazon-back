import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { EnumRole, User } from '@prisma/client'
import { Request } from 'express'

export class OnlyAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>()
		const user = request.user as User

		if (user.role !== EnumRole.ADMIN) {
			throw new ForbiddenException(`You have no rights, ${user.role}! You need to be ADMIN`)
		}

		return true
	}
}

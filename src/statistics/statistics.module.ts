import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	imports: [UserModule],
	controllers: [StatisticsController],
	providers: [StatisticsService, PrismaService, UserService, PaginationService]
})
export class StatisticsModule {}

import { Module } from '@nestjs/common'
import { PaginationModule } from 'src/pagination/pagination.module'
import { PrismaService } from 'src/prisma.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	imports: [UserModule, PaginationModule],
	controllers: [StatisticsController],
	providers: [StatisticsService, PrismaService, UserService]
})
export class StatisticsModule {}

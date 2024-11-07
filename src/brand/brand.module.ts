import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { BrandController } from './brand.controller'
import { BrandService } from './brand.service'

@Module({
	controllers: [BrandController],
	providers: [BrandService, PrismaService, PaginationService]
})
export class BrandModule {}

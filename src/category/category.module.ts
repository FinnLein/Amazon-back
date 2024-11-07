import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { CategoryService } from '../../category.service'
import { CategoryController } from './category.controller'

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, PrismaService, PaginationService]
})
export class CategoryModule {}

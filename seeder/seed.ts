import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import { hash } from 'argon2'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const products: Product[] = []

	for (let i = 0; i < quantity; i++) {
		const productName = faker.commerce.productName()
		const categoryName = faker.commerce.department()

		const product = await prisma.product.create({
			data: {
				name: productName,
				slug: faker.helpers.slugify(productName).toLowerCase(),
				description: faker.commerce.productDescription(),
				price: +faker.commerce.price({ min: 10, max: 999, dec: 0 }),
				images: Array.from({
					length: faker.number.int({ min: 2, max: 6 })
				}).map(() => faker.image.url({ width: 500, height: 500 })),
				category: {
					create: {
						name: categoryName,
						slug: faker.helpers.slugify(categoryName).toLowerCase(),
						description: faker.commerce.productDescription()
					}
				},
				brand: 'Iphone',
				reviews: {
					create: [
						{
							rating: faker.number.int({ min: 1, max: 5 }),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: 10
								}
							}
						},
						{
							rating: faker.number.int({ min: 1, max: 5 }),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: 10
								}
							}
						}
					]
				}
			}
		})

		products.push(product)
	}
	console.log(`Created ${products.length} products`)
}
const createUsers = async (quantity: number) => {
	for (let i = 0; i < quantity; i++) {
		const email = faker.internet.email()
		const name = faker.person.firstName()
		const avatarPath = faker.image.avatar()
		const password = await hash('123456')
		const createdAt = faker.date.past({ years: 1 })
		const phone = faker.phone.number('+7 (###) ###-##-##')

		const updatedAt = new Date(
			createdAt.getTime() +
				Math.random() * (new Date().getTime() - createdAt.getTime())
		)

		await prisma.user.create({
			data: {
				email,
				name,
				avatarPath,
				password,
				createdAt,
				updatedAt,
				phone
			}
		})
	}
}

async function main() {
	console.log('Start seeding')
	await createUsers(20)
	await createProducts(20)
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

import 'src/scss/styles.scss';

type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

type PaymentType = 'Онлайн' | 'При получении';

interface IProduct {
	id: number;
	name: string;
	category: Category;
	description: string;
	image: string | Blob;
	price: number;
}

interface IOrder {
	id: number;
	paymentType: PaymentType;
	address: string;
	email: string;
	phone: number;
}

class Product implements IProduct {
	id: number;
	name: string;
	category: Category;
	description: string;
	image: string | Blob;
	price: number;

	constructor(data: Partial<IProduct>) {
		this.id = data.id ?? 0;
		this.name = data.name ?? '';
		this.category = data.category ?? 'другое';
		this.description = data.description ?? '';
		this.image = data.image ?? '';
		this.price = data.price ?? 0;
	}
}

class Order implements IOrder {
	id: number;
	paymentType: PaymentType;
	address: string;
	email: string;
	phone: number;

	constructor(data: Partial<IOrder>) {
		this.id = data.id ?? 0;
		this.paymentType = data.paymentType ?? 'Онлайн';
		this.address = data.address ?? '';
		this.email = data.email ?? '';
		this.phone = data.phone ?? 0;
	}
}

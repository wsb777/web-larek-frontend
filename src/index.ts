import 'src/scss/styles.scss';

type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

type PaymentType = 'Онлайн' | 'При получении';

interface IProduct {
	_id: number;
	name: string;
	category: Category;
	description: string;
	image: string | Blob;
	price: number;
	addProduct(_id: number, name: string, price: number): void;
}

interface IOrder {
	_id: number;
	paymentType: PaymentType;
	address: string;
	email: string;
	phone: number;
	products: IProduct[];
	deleteProduct(productId: number): void;
}

interface IProductsData {
	products: IProduct[];
}

type TProductCardInfo = Pick<IProduct, 'category' | 'name' | 'image' | 'price'>;

type TProductInfo = Pick<IProduct, 'category' | 'name' | 'description' | 'price' | 'image'>;

type TProductOrder = Pick<IProduct, 'name' | 'price'>

type TOrderBasket = Pick<IOrder, 'products'>;

type TOrderDelivery = Pick<IOrder, 'paymentType' | 'address'>;

type TOrderContacts = Pick <IOrder, 'email' | 'phone'>;

class Product implements IProduct {
	_id: number;
	name: string;
	category: Category;
	description: string;
	image: string | Blob;
	price: number;
	addProduct(_id: number, name: string, price: number): void {

	};

	constructor(data: Partial<IProduct>) {
		this._id = data._id ?? 0;
		this.name = data.name ?? '';
		this.category = data.category ?? 'другое';
		this.description = data.description ?? '';
		this.image = data.image ?? '';
		this.price = data.price ?? 0;
	}
}

class Order implements IOrder {
	_id: number;
	paymentType: PaymentType;
	address: string;
	email: string;
	phone: number;
	products: IProduct[];
	deleteProduct(productId: number): void {

	};

	constructor(data: Partial<IOrder>) {
		this._id = data._id ?? 0;
		this.paymentType = data.paymentType ?? 'Онлайн';
		this.address = data.address ?? '';
		this.email = data.email ?? '';
		this.phone = data.phone ?? 0;
		this.products = data.products ?? [];
	}
}

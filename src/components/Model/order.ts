import { EventEmitter, IEvents } from "../base/events";
import * as type from "../../types";

export class Order implements type.IOrder {
	products: type.IProduct[];
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	constructor() {
		this.products = [];
	}
	set productsData(data: type.IProduct[]) {
		this.products = data;
	}

	sumProducts() {
		this.total = 0;
		this.products.forEach(item => {
			this.total += item.price;
		});
		return this.total;
	}

	setProduct(data: type.IProduct) {
		this.products.push(data);
	}

	clearProducts() {
		this.products = []
	}

	getCount() {
		return this.products.length;
	}

	deleteProduct(productId: string) {
		const index = this.products.findIndex((item) => item.id === productId);

		if (index !== -1) {
			this.products.splice(index, 1);
			console.log(this.products);
		} else {
			console.error(`Product with ID ${productId} not found`);
		}
	}

	checkProduct(productId: string) {
		const productFound = this.products.find(product => product.id === productId);
		if (productFound) {
			return true;
		} else {
			return false;
		}
	}
	setEmail(data: string) {
		this.email = data
	}
	setAddress(data: string) {
		this.address = data
	}
	setPhone(data: string) {
		this.phone = data
	}
	setPayment(data: string) {
		this.payment = data
	}

	makePost() {
		let productsId: any[] = []
		this.products.forEach(item => {
			productsId.push(item.id)
		});

		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: productsId
		}
	}
}
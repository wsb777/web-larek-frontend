import { EventEmitter, IEvents } from "../base/events";
import * as type from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export class Product {
	protected element: HTMLElement;
	protected button: HTMLButtonElement;
	protected title: HTMLElement;
	protected price: HTMLElement;
	protected image: HTMLImageElement;
	protected productId: string;
	protected category: HTMLElement;
	protected events: IEvents;
	protected description: string;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);
		this.button = this.element.querySelector('.card');
		this.title = this.element.querySelector('.card__title');
		this.category = this.element.querySelector('.card__category');
		this.price = this.element.querySelector('.card__price');
		this.image = this.element.querySelector('.card__image');

		this.element.addEventListener('click', () => this.events.emit('product:selected', { product: this }));
	}

	setData(productData: Partial<type.IProduct>) {
		this.productId = productData.id;
		this.price.textContent = String(productData.price) + " синапсов";
		this.category.textContent = String(productData.category);
		switch (productData.category) {
			case "софт-скил": {
				this.category.classList.add('card__category_soft');
				break;
			}
			case "кнопка": {
				this.category.classList.add('card__category_button');
				break;
			}
			case "дополнительное": {
				this.category.classList.add('card__category_additional');
				break;
			}
			case "другое": {
				this.category.classList.add('card__category_other');
				break;
			}
			case "хард-скил": {
				this.category.classList.add('card__category_hard');
				break;
			}
		}
		this.title.textContent = String(productData.title);
		this.image.src = CDN_URL + productData.image;
		this.description = productData.description;
	}

	get id() {
		return this.productId;
	}

	render() {
		return this.element;
	}
}



export class ProductData implements type.IProductsData {
	protected _products: type.IProduct[];
	protected _total: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set products(products: type.IProduct[]) {
		this._products = products;
		this.events.emit('products:changed')
	}

	get products() {
		return this._products;
	}

	set total(total: number) {
		this._total = total
	}

	get total() {
		return this._total
	}

	getProduct(productId: string) {
		return this._products.find((item) => item.id === productId);
	}
}

import { IPreviewProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { cloneTemplate } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { Modal } from "./Modal";


export class PreviewProduct extends Component<IPreviewProduct> {
	private titleElement: HTMLElement;
	private imageElement: HTMLImageElement;
	private descriptionElement: HTMLElement;
	private categoryElement: HTMLElement;
	private priceElement: HTMLElement;
	private button: HTMLElement;
	private id: string;
	element: HTMLElement;
	private price: number;
	_card:HTMLElement;


	constructor(container: HTMLElement, events: IEvents) {
		super(container)
		this.titleElement = this.container.querySelector(".card__title");
		this.imageElement = this.container.querySelector(".card__image");
		this.descriptionElement = this.container.querySelector(".card__text");
		this.categoryElement = this.container.querySelector(".card__category");
		this.priceElement = this.container.querySelector(".card__price");
		this.button = this.container.querySelector(".card__button");
		this.button.addEventListener('click', () => {
			events.emit(`product:toBasket`, { product: this.id })
			this.button.setAttribute('disabled', 'false');
			this.button.textContent = "В корзине";
		});
	}

	set contentData({ title, description, image, category, price, id }: { title: string, description: string, image: string; category: string; price: number; id: string }) {
		this.imageElement.src = CDN_URL + image;
		this.imageElement.alt = `Изображение ${title}`;
		this.titleElement.textContent = title;
		this.descriptionElement.textContent = description;
		this.categoryElement.textContent = category;
		this.price = price;
		if (price === null) {
			this.priceElement.textContent = "Бесценно";
		}
		else {
			this.priceElement.textContent = String(price) + " синапсов";
		}

		this.id = id
		switch (category) {
			case "софт-скил": {
				this.categoryElement.classList.remove(...this.categoryElement.classList);
				this.categoryElement.classList.add('card__category');
				this.categoryElement.classList.add('card__category_soft');
				break;
			}
			case "кнопка": {
				this.categoryElement.classList.remove(...this.categoryElement.classList);
				this.categoryElement.classList.add('card__category');
				this.categoryElement.classList.add('card__category_button');
				break;
			}
			case "дополнительное": {
				this.categoryElement.classList.remove(...this.categoryElement.classList);
				this.categoryElement.classList.add('card__category');
				this.categoryElement.classList.add('card__category_additional');
				break;
			}
			case "другое": {
				this.categoryElement.classList.remove(...this.categoryElement.classList);
				this.categoryElement.classList.add('card__category');
				this.categoryElement.classList.add('card__category_other');
				break;
			}
			case "хард-скил": {
				this.categoryElement.classList.remove(...this.categoryElement.classList);
				this.categoryElement.classList.add('card__category');
				this.categoryElement.classList.add('card__category_hard');
				break;
			}
		}
	}
	checkButton(solution: boolean) {
		if (solution === true) {
			this.button.setAttribute('disabled', 'false');
			this.button.textContent = "В корзине";
		}
		else {
			this.button.textContent = "В корзину";
			this.button.removeAttribute('disabled');
		}
		if (this.price === null) {
			this.button.textContent = "Бесценно";
			this.button.setAttribute('disabled', 'false');
		}
	}
}
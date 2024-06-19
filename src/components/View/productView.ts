import { IPreviewProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";


export class PreviewProduct extends Component<IPreviewProduct> {
	private titleElement: HTMLElement;
	private imageElement: HTMLImageElement;
	private descriptionElement: HTMLElement;
	private categoryElement: HTMLElement;
	private priceElement: HTMLElement;
	private button: HTMLButtonElement;
	private id: string;
	element: HTMLElement;
	private price: number;
	_card:HTMLElement;
	protected _categoryColor = <Record<string, string>> { // описания категории
		"софт-скил": "soft",
		"другое": "other",
		"дополнительное": "additional",
		"кнопка": "button",
		"хард-скил": "hard"
	  }


	constructor(container: HTMLElement, events: IEvents) {
		super(container)
		this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
		this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
		this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
		this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
		this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
		this.button = ensureElement<HTMLButtonElement>(".card__button", this.container);
		this.button.addEventListener('click', () => {
			events.emit(`product:toBasket`, { product: this.id })
			this.button.setAttribute('disabled', 'false');
			this.setText(this.button,"В корзине");
		});
	}

	set contentData({ title, description, image, category, price, id }: { title: string, description: string, image: string; category: string; price: number; id: string }) {
		this.imageElement.src = CDN_URL + image;
		this.imageElement.alt = `Изображение ${title}`;
		this.setText(this.titleElement, title);
		this.setText(this.descriptionElement, description);
		this.setText(this.categoryElement, category);
		this.price = price;
		if (price === null) {
			this.setText(this.priceElement, "Бесценно");
		}
		else {
			this.setText(this.priceElement,String(price) + " синапсов");
		}

		this.id = id;
		this.toggleClass(this.categoryElement,`card__category_${this._categoryColor[category]}`,true);
	}
	checkButton(solution: boolean) {
		if (solution === true) {
			this.button.setAttribute('disabled', 'false');
			this.setText(this.button, "В корзине");
		}
		else {
			this.setText(this.button, "В корзину");
			this.button.removeAttribute('disabled');
		}
		if (this.price === null) {
			this.setText(this.button, "Бесценно");
			this.button.setAttribute('disabled', 'false');
		}
	}
}
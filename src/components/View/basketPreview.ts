import { IOrder, IProduct, IProductsData } from "../../types";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { Order } from "../Model/order";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { Modal } from "./Modal";


interface IPreviewBasket {
  contentData: {
    products: IProduct[];
  }
}


export class PreviewBasket extends Component<IPreviewBasket> {

  private list: HTMLElement;
  private button: HTMLButtonElement;
  private cardBasketTemplate: HTMLTemplateElement;
  private basketPrice: HTMLElement;
  private headerBasket: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.list = ensureElement<HTMLElement>('.basket__list', this.container);
    this.button = ensureElement<HTMLButtonElement>('.button', this.container);
    this.button.addEventListener('click', () => events.emit('payment:on'))
    this.headerBasket = ensureElement<HTMLButtonElement>('.header__basket');
    this.headerBasket.addEventListener('click', () => events.emit('basket:open'));
    this.cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container)
  }

  setData(data: IOrder, events: IEvents) {
    if (data.products.length) {
      this.list.innerHTML = "";
      this.button.removeAttribute('disabled');
      for (let i = 0; i < data.products.length; i++) {
        const basketItem = cloneTemplate(this.cardBasketTemplate);
        this.setText(ensureElement<HTMLElement>('.basket__item-index', basketItem), String(i + 1));
        this.setText(ensureElement<HTMLElement>('.card__title', basketItem), data.products[i].title);
        this.setText(ensureElement<HTMLElement>('.card__price', basketItem), String(data.products[i].price) + " синапсов");
        const button = ensureElement<HTMLButtonElement>('.basket__item-delete', basketItem);
        button.addEventListener('click', () => {
          events.emit('product:delete', { product: data.products[i] })
          basketItem.remove()
        });
        this.list.append(basketItem);
      }
    }
    else {
      this.button.setAttribute('disabled', 'false');
      this.list.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  renderSum(data: number) {
    this.setText(this.basketPrice, String(data) + " синапсов")
  }
}
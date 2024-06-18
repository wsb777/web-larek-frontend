import { IOrder, IProduct, IProductsData } from "../../types";
import { cloneTemplate, createElement } from "../../utils/utils";
import { Order } from "../Model/order";
import { IEvents } from "../base/events";
import { Modal } from "./Modal";


interface IPreviewBasket {
  contentData: {
    products: IProduct[];
  }
}


export class PreviewBasket extends Modal<IPreviewBasket> {

  private element: HTMLElement;
  private content: HTMLElement;
  private list: HTMLElement;
  private button: HTMLElement;
  private productsCount: HTMLElement;
  private cardBasketTemplate:HTMLTemplateElement;
  private basketPrice:HTMLElement

  constructor(container: HTMLElement, events: IEvents, template: HTMLTemplateElement) {
    super(container, events)
    this.element = cloneTemplate(template);
    this.content = this.container.querySelector(".modal__content");
    this.content.replaceChildren(this.element);
    this.list = this.element.querySelector('.basket__list');
    this.button = this.element.querySelector('.button');
    this.button.addEventListener('click', () => this.events.emit('payment:on'))
    this.productsCount = document.querySelector('.header__basket-counter');
    const basket = document.querySelector('.header__basket');
    basket.addEventListener('click', () => events.emit('basket:open'));
    this.cardBasketTemplate = document.querySelector('#card-basket');
    this.basketPrice = this.element.querySelector('.basket__price')
  }

  setData(data: IOrder) {
    if (data.products.length) {
      this.list.innerHTML = "";
      this.button.removeAttribute('disabled');
      for (let i = 0; i < data.products.length; i++) {
        const basketItem = cloneTemplate(this.cardBasketTemplate);
        basketItem.querySelector('.basket__item-index').textContent = String(i + 1);
        basketItem.querySelector('.card__title').textContent = data.products[i].title;
        basketItem.querySelector('.card__price').textContent = String(data.products[i].price) + " синапсов";
        const button = basketItem.querySelector('.basket__item-delete');
        button.addEventListener('click', () => {
          this.events.emit('product:delete', { product: data.products[i] })
          basketItem.remove()
        });
        this.list.append(basketItem);
      }
    }
    else {
      this.button.setAttribute('disabled', 'false');
      this.list.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }

    super.open();
  }

  renderCount(data: number) {
    this.productsCount.textContent = String(data);
  }

  renderSum(data: number) {
    this.basketPrice.textContent = String(data) + " синапсов";
  }
}
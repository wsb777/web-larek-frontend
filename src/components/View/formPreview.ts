import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Modal } from "./Modal";

export interface IContactForm {
  contactForm: HTMLFormElement;
  buyButton: HTMLButtonElement;
}

export class ContactForm extends Modal<IContactForm> {
  content: HTMLElement;
  contactForm: HTMLFormElement;
  inputEmail: HTMLInputElement;
  inputNumber: HTMLInputElement;
  buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents, template: HTMLTemplateElement) {
    super(container, events);
    this.content = this.container.querySelector(".modal__content");
    this.contactForm = cloneTemplate(template);
    this.content.replaceChildren(this.contactForm);
    this.inputEmail = this.contactForm.querySelector('input[name="email"]');
    this.inputNumber = this.contactForm.querySelector('input[name="phone"]');
    this.buyButton = this.contactForm.querySelector('.order__button');
    this.contactForm.addEventListener('submit', (evt) => {
      const data = {
        phone: this.inputNumber.value,
        email: this.inputEmail.value
      }
      evt.preventDefault();
      this.events.emit('buy:on', data)
    })
  }
}

export interface IPaymentForm {
  buttonNext: HTMLButtonElement;
  valid: boolean;
}

export class PaymentForm extends Modal<IPaymentForm> {
  content: HTMLElement;
  paymentForm: HTMLFormElement;
  card: HTMLButtonElement;
  cash: HTMLButtonElement;
  buttonNext: HTMLButtonElement;
  input: HTMLInputElement;
  paymentType: string;
  address: string;

  constructor(container: HTMLElement, protected events: IEvents, template: HTMLTemplateElement,) {
    super(container, events);
    this.content = this.container.querySelector(".modal__content");
    this.paymentForm = cloneTemplate(template);
    this.content.replaceChildren(this.paymentForm);
    this.card = this.paymentForm.querySelector('button[name="card"]')
    this.cash = this.paymentForm.querySelector('button[name="cash"]')
    this.buttonNext = this.paymentForm.querySelector('.order__button');
    this.input = this.paymentForm.querySelector('.form__input');
    console.log(this.paymentForm);

    this.card.addEventListener('click', () => {
      this.paymentType = 'online';
    })

    this.cash.addEventListener('click', () => {
      this.paymentType = 'offline';
    })

    this.paymentForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.address = this.input.value;
      const data = {
        payment: this.paymentType,
        address: this.address
      }
      this.events.emit(`payment:click`, data);
    })
  }

}

export interface ISuccessful {
  success: HTMLElement;
  continueButton: HTMLButtonElement;
}

export class Successful extends Modal<Successful> {
  success: HTMLElement;
  continueButton: HTMLButtonElement;
  content: HTMLElement;
  sum: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents, template: HTMLTemplateElement) {
    super(container, events);
    this.content = this.container.querySelector(".modal__content");
    this.success = cloneTemplate(template);
    this.content.replaceChildren(this.success);
    this.sum = this.success.querySelector('.order-success__description');
    this.continueButton = this.success.querySelector('.order-success__close');
    this.success.addEventListener('submit', (evt) => {
      evt.preventDefault();
      super.close();
    })
  }
  setSum(data: number) {
    this.sum.textContent = "Списано " + String(data) + "синапсов"
  }
}

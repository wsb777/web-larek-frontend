import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form";
import { Modal } from "./Modal";

export interface IContactForm {
  contactForm: HTMLFormElement;
  buyButton: HTMLButtonElement;
}

export class ContactForm extends Form<IContactForm> {
  content: HTMLElement;
  contactForm: HTMLFormElement;
  inputEmail: HTMLInputElement;
  inputNumber: HTMLInputElement;
  buyButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents, template: HTMLTemplateElement) {
    super(container, events);
    this.content = this.container.querySelector(".modal__content");
    this.contactForm = cloneTemplate(template);
    this.content.replaceChildren(this.contactForm);
    this.inputEmail = this.contactForm.querySelector('input[name="email"]');
    this.buyButton = this.contactForm.querySelector('.button');
    this.inputEmail.addEventListener('input', () => {
      if (this.inputEmail.validity.valid && this.inputNumber.validity.valid) {
        this.buyButton.removeAttribute('disabled');
      }
      else {
        this.buyButton.setAttribute('disabled', 'true');
      }
    })
    this.inputNumber = this.contactForm.querySelector('input[name="phone"]');
    this.inputNumber.addEventListener('input', () => {
      if (this.inputEmail.validity.valid && this.inputNumber.validity.valid) {
        this.buyButton.removeAttribute('disabled');
      }
      else {
        this.buyButton.setAttribute('disabled', 'true');
      }
    })
    this.contactForm.addEventListener('submit', (evt) => {
      const data = {
        phone: this.inputNumber.value,
        email: this.inputEmail.value
      }
      this.events.emit('buy:on', data)
    })
  }
}

export interface IPaymentForm {
  buttonNext: HTMLButtonElement;
  valid: boolean;
}

export class PaymentForm extends Form<IPaymentForm> {
  content: HTMLElement;
  paymentForm: HTMLFormElement;
  card: HTMLButtonElement;
  cash: HTMLButtonElement;
  buttonNext: HTMLButtonElement;
  input: HTMLInputElement;
  paymentType: string;
  address: string;

  constructor(container: HTMLFormElement, protected events: IEvents, template: HTMLTemplateElement,) {
    super(container, events);
    this.content = this.container.querySelector(".modal__content");
    this.paymentForm = cloneTemplate(template);
    this.content.replaceChildren(this.paymentForm);
    this.card = this.paymentForm.querySelector('button[name="card"]');
    this.cash = this.paymentForm.querySelector('button[name="cash"]');
    this.buttonNext = this.paymentForm.querySelector('.order__button');
    this.input = this.paymentForm.querySelector('.form__input');
    this.input.addEventListener('input', () => {
      if (this.input.validity.valid && (this.card.classList.contains('button_alt-active') || this.cash.classList.contains('button_alt-active'))) {
        this.buttonNext.removeAttribute('disabled');
      }
      else {
        this.buttonNext.setAttribute('disabled', 'true');
      }
    })

    this.card.addEventListener('click', () => {
      this.paymentType = 'online';
      this.card.classList.add('button_alt-active');
      if (this.cash.classList.contains('button_alt-active')) {
        this.cash.classList.remove('button_alt-active');
      }
      if (this.input.validity.valid) {
        this.buttonNext.removeAttribute('disabled');
      }
      else {
        this.buttonNext.setAttribute('disabled', 'true');
      }
    })

    this.cash.addEventListener('click', () => {
      this.paymentType = 'offline';
      this.cash.classList.add('button_alt-active');
      if (this.card.classList.contains('button_alt-active')) {
        this.card.classList.remove('button_alt-active');
      }
      if (this.input.validity.valid ) {
        this.buttonNext.removeAttribute('disabled');
      }
      else {
        this.buttonNext.setAttribute('disabled', 'true');
      }
    })

    this.paymentForm.addEventListener('submit', (evt) => {
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
    this.continueButton.addEventListener('click', (evt) => {
      this.events.emit('continue');
    })
  }
  setSum(data: number) {
    this.sum.textContent = "Списано " + String(data) + " синапсов"
  }
}

import { cloneTemplate } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { Form } from "./Form";
import { Modal } from "./Modal";

export interface IContactForm {
  contactForm: HTMLFormElement;
  buyButton: HTMLButtonElement;
}

export class ContactForm extends Form<IContactForm> {
  content: HTMLElement;
  inputEmail: HTMLInputElement;
  inputNumber: HTMLInputElement;
  buyButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.inputEmail = this.container.querySelector('input[name="email"]');
    this.buyButton = this.container.querySelector('.button');
    this.inputEmail.addEventListener('input', () => {
      if (this.inputEmail.validity.valid && this.inputNumber.validity.valid) {
        this.buyButton.removeAttribute('disabled');
      }
      else {
        this.buyButton.setAttribute('disabled', 'true');
      }
    })
    this.inputNumber = this.container.querySelector('input[name="phone"]');
    this.inputNumber.addEventListener('input', () => {
      if (this.inputEmail.validity.valid && this.inputNumber.validity.valid) {
        this.buyButton.removeAttribute('disabled');
      }
      else {
        this.buyButton.setAttribute('disabled', 'true');
      }
    })
    this.container.addEventListener('submit', (evt) => {
      const data = {
        phone: this.inputNumber.value,
        email: this.inputEmail.value
      }
      this.events.emit('buy:on', data)
    })
  }
  get form() {
    return this.container;
  }
}

export interface IPaymentForm {
  buttonNext: HTMLButtonElement;
  valid: boolean;
}

export class PaymentForm extends Form<IPaymentForm> {
  content: HTMLElement;
  card: HTMLButtonElement;
  cash: HTMLButtonElement;
  buttonNext: HTMLButtonElement;
  input: HTMLInputElement;
  paymentType: string;
  address: string;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.card = this.container.querySelector('button[name="card"]');
    this.cash = this.container.querySelector('button[name="cash"]');
    console.log(this.container)
    this.buttonNext = this.container.querySelector('.order__button');
    this.input = this.container.querySelector('.form__input');
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

    this.container.addEventListener('submit', (evt) => {
      this.address = this.input.value;
      const data = {
        payment: this.paymentType,
        address: this.address
      }
      this.events.emit(`payment:click`, data);
    })
  }
  get form() {
    return this.container
  }

}

export interface ISuccessful {
  success: HTMLElement;
  continueButton: HTMLButtonElement;
}
export class Successful extends Component<Successful> {
  continueButton: HTMLButtonElement;
  _content: HTMLElement;
  sum: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.sum = this.container.querySelector('.order-success__description');
    this.continueButton = this.container.querySelector('.order-success__close');
    this.continueButton.addEventListener('click', (evt) => {
      this.events.emit('continue');
    })
  }
  setSum(data: number) {
    this.sum.textContent = "Списано " + String(data) + " синапсов"
  }
  get success () {
    return this.container
  }
}

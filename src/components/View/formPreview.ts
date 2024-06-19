import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { Form } from "./Form";

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
    this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.buyButton = ensureElement<HTMLButtonElement>('.button', this.container);
    this.inputEmail.addEventListener('input', () => {
      if (this.inputEmail.validity.valid && this.inputNumber.validity.valid) {
        this.buyButton.removeAttribute('disabled');
      }
      else {
        this.buyButton.setAttribute('disabled', 'true');
      }
    })
    this.inputNumber = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
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
    this.card = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.buttonNext = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.input = ensureElement<HTMLInputElement>('.form__input', this.container);
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
      this.toggleClass(this.card,'button_alt-active',true)
      this.toggleClass(this.cash,'button_alt-active',false)
      if (this.input.validity.valid) {
        this.buttonNext.removeAttribute('disabled');
      }
      else {
        this.buttonNext.setAttribute('disabled', 'true');
      }
    })

    this.cash.addEventListener('click', () => {
      this.paymentType = 'offline';
      this.toggleClass(this.card,'button_alt-active',false)
      this.toggleClass(this.cash,'button_alt-active',true)
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
    
    this.sum = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.continueButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.continueButton.addEventListener('click', (evt) => {
      this.events.emit('continue');
    })
  }
  setSum(data: number) {
    this.setText(this.sum, "Списано " + String(data) + " синапсов")
  }
  get success () {
    return this.container
  }
}

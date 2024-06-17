import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Modal<T> extends Component<T> {
  protected modal: HTMLElement;
  protected events: IEvents;
  protected page: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.page = document.querySelector('.page__wrapper')
    const closeButtonElement = this.container.querySelector(".modal__close");
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  open() {
    this.page.classList.add('page__wrapper_locked');
    this.container.classList.add("modal_active");
    document.addEventListener("keyup", this.handleEscUp);
  }

  close() {
    this.page.classList.remove('page__wrapper_locked')
    this.container.classList.remove("modal_active");
    this.events.emit('modal:close')
    document.removeEventListener("keyup", this.handleEscUp);
  }

  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  };
}

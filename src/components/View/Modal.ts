import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IModalData {
  content: HTMLElement;
}

export class Modal<IModalData> extends Component<IModalData> {
  protected modal: HTMLElement;
  protected events: IEvents;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    const closeButtonElement = container.querySelector(".modal__close");
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this.container.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
    document.addEventListener("keyup", this.handleEscUp);
    this.events.emit("modal:open")
  }

  close() {
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

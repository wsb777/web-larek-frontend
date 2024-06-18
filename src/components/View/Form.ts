import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected page:HTMLElement;
    

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.page = document.querySelector('.page__wrapper')

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });

        const closeButtonElement = this.container.querySelector(".modal__close");
        this.handleEscUp = this.handleEscUp.bind(this);
        closeButtonElement.addEventListener("click", this.close.bind(this));
        this.container.addEventListener("mousedown", (evt) => {
        if (evt.target === evt.currentTarget) {
            this.close();
        }
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    open() {
        this.container.classList.add("modal_active");
        document.addEventListener("keyup", this.handleEscUp);
        this.events.emit("modal:open")
    }

    close() {
        this.container.classList.remove("modal_active");
        document.removeEventListener("keyup", this.handleEscUp);
        this.events.emit("modal:close")
    }

    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === "Escape") {
            this.close();
        }
    };
}
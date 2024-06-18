import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import * as type from './types/index';
import { Product, ProductData } from './components/Model/product';
import { Order } from './components/Model/order';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL, settings} from './utils/constants';
import { PreviewBasket } from './components/View/basketPreview';
import { PreviewProduct } from './components/View/productView';
import { ContactForm, PaymentForm, Successful } from './components/View/formPreview';
import { Page } from './components/Page';

// Добрый вечер! Просмотрел полностью Оно тебе надо, больше понял об ООП, но хочется добить этот проект в такой логике. Следующий реализовать в более правильно ООП
// Почитал про enum тут https://scriptdev.ru/guide/015/#_1 , правильно ли я понимаю, что его стоит использовать только в больших проектах? Такой вопрос, потому что как будто в нашем он усложит логику
// Я переписал вашу логику с гетера на функцию, вроде получилось, сейчас я понимаю как гетеры и сеттеры работают, но когда начинал работать с проектом, не очень понимал, поэтому тут был подход через функции. В дальнейшем буду пробовать через сеттеры

// СОЗДАНИЕ КЛАССОВ
const events = new EventEmitter();
const baseApi: type.IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const products = new ProductData(events);
const order = new Order();
const page = new Page(document.body, events);

// НАХОЖДЕНИЕ НУЖНЫХ ТЕМПЛЕЙТОВ И ЭЛЕМЕНТОВ
const productTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const productPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const basketPreviewTemplate: HTMLTemplateElement = document.querySelector('#basket');
const cardForm:HTMLElement = document.querySelector('.modal .card');
const basketForm:HTMLElement = document.querySelector('.modal .basket');
const payment:HTMLElement = document.querySelector('.modal .payment');
const contacts:HTMLElement = document.querySelector('.modal .contact');
const success:HTMLElement = document.querySelector('.modal .order-success');

// СОЗДАНИЕ КЛАССОВ ФОРМ
const paymentForm = new PaymentForm(payment.closest('.modal'),events,document.querySelector('#order'));
const contactsForm = new ContactForm(contacts.closest('.modal'),events,document.querySelector('#contacts'));
const successForm = new Successful(success.closest('.modal'),events,document.querySelector('#success'));

// СОЗДАНИЕ ПЕРВЬЮ ДЛЯ ПРОДУКТОВ
const productPreview = new PreviewProduct(cardForm.closest('.modal'), events, productPreviewTemplate);
const basketPreview = new PreviewBasket(basketForm.closest('.modal'), events, basketPreviewTemplate);

// events.onAll((event) => {
//     console.log(event.eventName, event.data)
// })

// СБОР ДАННЫХ ДЛЯ ГАЛЛЕРЕИ;
api.getProducts()
  .then((productList) => {
    products.products = productList;
    events.emit("products:loaded");
  })
  .catch((err) => {
    console.error(err);
  });

// ВЫВОД НА СТРАНИЦУ ВСЕХ ПРОДУКТОВ
events.on('products:loaded', () => {
	page.catalog = products.products.map(item => {
        const card = new Product(productTemplate,events);
		card.setData(item);
		return card.render()
        });
    });
// ВЫВОД ПРЕВЬЮ О ПРОДУКТЕ
events.on('product:selected', (data: { product: Product }) => {
	const { product } = data;
	const { title, price, description, category, image, id} = products.getProduct( product.id );
	const contentData = {title, price, description, category, image, id}
	productPreview.render({ contentData });
	productPreview.checkButton(order.checkProduct(product.id));
	productPreview.open();
});

// ДОБАВЛЕНИЕ ПРОДУКТА В КОРЗИНУ
events.on(`product:toBasket`, (data: {product: string}) => {
	const id = data.product;
	order.setProduct(products.getProduct(id));
	basketPreview.renderCount(order.getCount());
})

// ОТКРЫТИЕ КОРЗИНЫ
events.on('basket:open', () => {
	basketPreview.setData(order);
	basketPreview.renderSum(order.sumProducts());
	basketPreview.open();
})

// УДАЛЕНИЕ ПРОДУКТА
events.on('product:delete', (data:{product: type.IProduct})=> {
	const productData = data.product;
	order.deleteProduct(productData.id);
	basketPreview.setData(order);
	basketPreview.renderSum(order.sumProducts());
})

// ПЕРЕХОД К ЗАКАЗУ
events.on('payment:on', () => {
	basketPreview.close();
	paymentForm.render();
	paymentForm.open();
})

// ПЕРЕХОД К КОНТАКТАМ
events.on('payment:click', (data:{payment:string, address:string}) => {
	order.setAddress(data.address);
	order.setPayment(data.payment);
	paymentForm.close();
	contactsForm.open();
})

// ОТПРАВКА ЗАКАЗА
events.on('buy:on', (data : {phone:string, email:string}) => {
	order.setEmail(data.email);
	order.setPhone(data.phone)
	contactsForm.close();
	api.sendOrder(order.makePost()).then( () => {
		successForm.setSum(order.sumProducts());
		order.clearProducts();
		basketPreview.renderCount(order.getCount());
		successForm.open();
	}).catch(err => console.log(err))
})

// ЗАКРЫТИЕ ФОРМЫ УСПЕШНОЙ ПОКУПКИ
events.on('continue', () => {
	successForm.close();
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
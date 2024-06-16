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

const events = new EventEmitter();
const baseApi: type.IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const products = new ProductData(events);
const order = new Order();
const productTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const productPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const basketPreviewTemplate: HTMLTemplateElement = document.querySelector('#basket');
const cardForm:HTMLElement = document.querySelector('.modal .card');
const basketForm:HTMLElement = document.querySelector('.modal .basket');
const payment:HTMLElement = document.querySelector('.modal .payment');
const contacts:HTMLElement = document.querySelector('.modal .contact');
const success:HTMLElement = document.querySelector('.modal .order-success');

const paymentForm = new PaymentForm(payment.closest('.modal'),events,document.querySelector('#order'));
const contactsForm = new ContactForm(contacts.closest('.modal'),events,document.querySelector('#contacts'));
const successForm = new Successful(success.closest('.modal'),events,document.querySelector('#success'));

const productPreview = new PreviewProduct(cardForm.closest('.modal'), events, productPreviewTemplate);
const basketPreview = new PreviewBasket(basketForm.closest('.modal'), events, basketPreviewTemplate);
const basket = document.querySelector('.header__basket');
basket.addEventListener('click', () => events.emit('basket:open'));

// events.onAll((event) => {
//     console.log(event.eventName, event.data)
// })

Promise.all([api.getProducts()])
	.then(([productList]) => {
		products.products = productList
		events.emit("products:loaded")
	})
	.catch((err) => {
		console.error(err);
	});

	events.on('products:loaded', () => {
		products.products.forEach((product) => {
		  const newProduct = new Product(productTemplate, events);
		  newProduct.setData(product);
		  gallery.append(newProduct.render());
		});
	  });

const gallery  = document.querySelector('.gallery');

events.on('product:selected', (data: { product: Product }) => {
	const { product } = data;
	const { title, price, description, category, image, id} = products.getProduct( product.id );
	const contentData = {title, price, description, category, image, id}
	productPreview.render({ contentData });
	productPreview.checkButton(order.checkProduct(product.id));
	productPreview.open();
});

events.on(`product:toBasket`, (data: {product: string}) => {
	const id = data.product;
	order.setProduct(products.getProduct(id));
	basketPreview.renderCount(order.getCount());
})

events.on('basket:open', () => {
	basketPreview.setData(order);
	basketPreview.renderSum(order.sumProducts());
	basketPreview.open();
})

events.on('product:delete', (data:{product: type.IProduct})=> {
	const productData = data.product;
	order.deleteProduct(productData.id);
	basketPreview.renderSum(order.sumProducts());
})

events.on('payment:on', () => {
	basketPreview.close();
	paymentForm.render();
	paymentForm.open();
})

events.on('payment:click', (data:{payment:string, address:string}) => {
	order.setAddress(data.address);
	order.setPayment(data.payment);
	paymentForm.close();
	contactsForm.open();
})

events.on('buy:on', (data : {phone:string, email:string}) => {
	order.setEmail(data.email);
	order.setPhone(data.phone)
	contactsForm.close();
	api.sendOrder(order.makePost());
	successForm.setSum(order.sumProducts());
	order.clearProducts();
	successForm.open()
})
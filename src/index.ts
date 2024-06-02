import './scss/styles.scss';

type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

type PaymentType = 'Онлайн' | 'При получении';

interface IProduct {
    name: string;
    category: Category;
    description: string;
    image: ImageData;
    price: number;
};

interface IOrder {
    paymentTyoe: PaymentType;
    address: string;
    email: RegExp;
    phone: RegExp;
};
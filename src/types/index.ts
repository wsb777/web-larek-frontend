import { IEvents } from "../components/base/events";

export type ApiResponse<Type> = {
    total: number,
    items: Type[]
};

export type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type PaymentType = 'Онлайн' | 'При получении';

export interface IProduct {
	id: string;
	title: string;
	category: string;
	description: string;
	image: string | Blob;
	price: number;
}

export interface IProductsData {
	total:number;
	products: IProduct[];
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IPreviewProduct {
	contentData: {
		title: string;
		price: number;
		description: string;
		category: string;
		image: string | Blob;
		id:string;
	}
 }

export interface IOrder {
	products: IProduct[];
}
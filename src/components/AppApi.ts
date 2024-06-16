import { ApiResponse, IApi, IProduct, IOrder } from '../types';
import { API_URL } from '../utils/constants';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<IProduct[]> {
		return this._baseApi.get(`/product`).then((data: ApiResponse<IProduct>) =>
			data.items
		);;
	}

	sendOrder(data: object): Promise<object> {
		return this._baseApi.post<object>(`/order`, data, 'POST').then((res: object) => res);
	}
}
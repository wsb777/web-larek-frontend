# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание базовых классов

api.ts

1. Класс Api

baseUrl - строка содержащая URL
options - объект с дополнительными опциями для запросов

constructor(baseUrl: string, options: RequestInit = {}) - инициализирует класс принимая базовую URL и опциональные настройки для запроса

Методы

protected handleResponse(response: Response) - обработчик ответа от сервера. Проверяет статус ответа от сервер и возращает данные в формате JSON. В случае ошибки, возвращает сообщение об ошибке

get(uri: string) - выполняет get-запрос по uri относительно базовой URL

post(uri: string, data: object, method: ApiPostMethods = 'POST') - выполняет post запрос по указаному uri. Принимает данные data для отправки в теле запроса


events.ts

2. class EventEmitter implements IEvents
_events: Map<EventName, Set<Subscriber>> - хранит события, ключи - имена событий, а значения - множества обработчиков
constructor - инициализирует _events

Методы

on<T extends object>(eventName: EventName, callback: (event: T) => void) - подписывает обработчик события callback на событие event. Обработчик будет получать данные типа T.

off(eventName: EventName, callback: Subscriber) - отписывает обработчик события callback от события even

emit<T extends object>(eventName: string, data?: T) - инициирует event с data

onAll(callback: (event: EmitterEvent) => void) - подписывает обработчик callback на все события

offAll() - сбрасывает все обработчики событий

trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void - генерирует событие event с данными из data и context

3. class Product implements IProduct 
реализует интерфейс IProduct

4. class Order implements IOrder
реализует интерфейс IOrder

## Ключевые типы данных

api.ts

1. type ApiListResponse<Type> = {
    total: number,
    items: Type[]
}; описывает структуру ответа от API содержащего массив элементов типа Type и общее количество элементов

2. type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'; перечисление допустимых методов

events.ts
 
3. type EventName = string | RegExp; тип события, который может быть строкой или регулярным выражением

4. type Subscriber = Function; функция, которая будет вызываться при наступлении события

5. type EmitterEvent = {
    eventName: string,
    data: unknown
}; объект описывающий события, eventName - имя события, data - данные

6. interface IEvents
on<T extends object>(event: EventName, callback: (data: T) => void) - получает данные типа T и подписывает обработчик события callback на event

emit<T extends object>(event: string, data?: T) - инициирует event с data

trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void - генерирует событие event с данными из data и context

index.ts 

7. type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил'; перечисление основных видов продуктов

8. type PaymentType = 'Онлайн' | 'При получении'; - перечисление допустимых видов оплаты

9. interface IProduct - описывает структуру данных продукта

10. interface IOrder - описывает структуру данных заказа
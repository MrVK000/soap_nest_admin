import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateCouponPayload,
  loginFormPayload,
  UpdateCouponPayload,
  UpdateOrderStatusPayload,
} from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = environment.apiBaseUrl;
  private loginAdminUrl: string = "admin/login";

  private createProductUrl: string = "product/create";
  private updateProductUrl: string = "product/update/";
  private deleteProductUrl: string = "product/delete/";
  private listProductsUrl: string = "product/list";
  private listFeaturedProductsUrl: string = "public/product/featured";
  private getProductUrl: string = "product/get/";

  private bulkSaveFeatureProductUrl: string = "product/feature-bulk";
  private bulkSaveUnfeatureProductUrl: string = "product/unfeature-bulk";
  private featureProductUrl: string = "product/feature/";
  private unfeatureProductUrl: string = "product/unfeature/";

  private listCouponssUrl: string = "coupon/list";
  private createCouponUrl: string = "coupon/create";
  private updateCouponUrl: string = "coupon/update/";
  private deleteCouponUrl: string = "coupon/delete/";

  private listOrdersUrl: string = "orders/list";
  private updateOrderUrl: string = "orders/";
  private deleteOrderUrl: string = "orders/";
  private getOrderUrl: string = "orders/";
  private getOrdersCountUrl: string = "orders/count";

  private listUsersUrl: string = "user/list";
  private getUserUrl: string = "user/get/";
  private getUsersCountUrl: string = "user/count";

  private listReviewsUrl: string = "review/list";
  private getReviewUrl: string = "review/get-by-id/";

  private listMessagesUrl: string = "message/list";
  private getMessageUrl: string = "message/get/";
  private getMessagesCountUrl: string = "message/count";
  private deleteMessageUrl: string = "message/delete/";
  private bulkDeleteMessageUrl: string = "message/bulk-delete";
  private markAllAsReadUrl: string = "message/read";

  private getMonthlyRevenueUrl: string = "analytics/month";
  private getStateWiseRevenueUrl: string = "analytics/state";
  private getDistrictWiseRevenueUrl: string = "analytics/district";


  constructor(private http: HttpClient) { }

  loginAdmin(payload: loginFormPayload) {
    return this.http.post(this.baseUrl.concat(this.loginAdminUrl), payload, { withCredentials: true });
  }

  listProducts(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listProductsUrl), { params, headers });
  }

  getProduct(productId: string) {
    return this.http.get((this.baseUrl.concat(this.getProductUrl)).concat(productId));
  }

  createProduct(payload: FormData) {
    return this.http.post(this.baseUrl + this.createProductUrl, payload);
  }

  updateProduct(payload: FormData, productId: string) {
    return this.http.put((this.baseUrl.concat(this.updateProductUrl)).concat(productId), payload);
  }

  deleteProduct(productId: string) {
    return this.http.delete((this.baseUrl.concat(this.deleteProductUrl)).concat(productId));
  }

  bulkSaveFeatureProduct(productIds: string[]) {
    return this.http.patch(this.baseUrl.concat(this.bulkSaveFeatureProductUrl), { productIds });
  }

  bulkSaveUnfeatureProduct(productIds: string[]) {
    return this.http.patch(this.baseUrl.concat(this.bulkSaveUnfeatureProductUrl), { productIds });
  }

  featureProduct(productId: string) {
    return this.http.patch(this.baseUrl.concat(this.featureProductUrl + productId), null);
  }

  unfeatureProduct(productId: string) {
    return this.http.patch(this.baseUrl.concat(this.unfeatureProductUrl + productId), null);
  }

  listFeaturedProducts(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listFeaturedProductsUrl), { params, headers });
  }

  listCoupons(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listCouponssUrl), { params, headers });
  }

  createCoupon(payload: CreateCouponPayload) {
    return this.http.post(this.baseUrl + this.createCouponUrl, payload);
  }

  updateCoupon(payload: UpdateCouponPayload, id: number) {
    return this.http.put((this.baseUrl.concat(this.updateCouponUrl)).concat(id.toString()), payload);
  }

  deleteCoupon(id: number) {
    return this.http.delete((this.baseUrl.concat(this.deleteCouponUrl)).concat(id.toString()));
  }

  listOrders(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listOrdersUrl), { params, headers });
  }

  getOrder(orderId: string) {
    return this.http.get((this.baseUrl.concat(this.getOrderUrl)).concat(orderId));
  }

  upateOrder(payload: UpdateOrderStatusPayload, orderId: number) {
    return this.http.put((this.baseUrl.concat(this.updateOrderUrl)).concat(orderId.toString()), payload);
  }

  deleteOrder(orderId: number) {
    return this.http.delete((this.baseUrl.concat(this.deleteOrderUrl)).concat(orderId.toString()));
  }

  getOrdersCount() {
    return this.http.get(this.baseUrl.concat(this.getOrdersCountUrl));
  }

  listUsers(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listUsersUrl), { params, headers });
  }

  getUser(customerId: string) {
    return this.http.get((this.baseUrl.concat(this.getUserUrl)).concat(customerId));
  }

  getUsersCount() {
    return this.http.get(this.baseUrl.concat(this.getUsersCountUrl));
  }

  listReviews(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listReviewsUrl), { params, headers });
  }

  getReview(id: number) {
    return this.http.get((this.baseUrl.concat(this.getReviewUrl)).concat(id.toString()));
  }

  getReviewsByProduct(productId: string, page: number = 1, limit: number = 10) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get(`${this.baseUrl}review/get-by-product/${productId}`, { params });
  }

  listMessages(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const headers = new HttpHeaders().set('x-show', 'false');

    return this.http.get(this.baseUrl.concat(this.listMessagesUrl), { params, headers });
  }

  getMessage(id: number) {
    return this.http.get((this.baseUrl.concat(this.getMessageUrl)).concat(id.toString()));
  }

  geMessagesCount() {
    const headers = new HttpHeaders().set('x-show', 'false');
    return this.http.get(this.baseUrl.concat(this.getMessagesCountUrl), { headers });
  }

  deleteMessage(id: number) {
    return this.http.delete((this.baseUrl.concat(this.deleteMessageUrl)).concat(id.toString()));
  }

  deleteAllMessage(ids: number[]) {
    return this.http.post(this.baseUrl.concat(this.bulkDeleteMessageUrl), { ids });
  }

  markAllAsRead(ids: number[]) {
    return this.http.post(this.baseUrl.concat(this.markAllAsReadUrl), { ids });
  }

  getMonthlyRevenue(year: number) {
    return this.http.get(this.baseUrl.concat(this.getMonthlyRevenueUrl.concat("?year=" + year)));
  }

  getStateWiseRevenue(year: number) {
    return this.http.get(this.baseUrl.concat(this.getStateWiseRevenueUrl.concat("?year=" + year)));
  }

  getDistrictWiseRevenue(year: number) {
    return this.http.get(this.baseUrl.concat(this.getDistrictWiseRevenueUrl.concat("?year=" + year)));
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateCouponPayload,
  CreateProductPayload,
  loginFormPayload,
  UpdateCouponPayload,
  UpdateOrderStatusPayload,
  UpdateProductPayload,
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
    return this.http.post(this.baseUrl.concat(this.loginAdminUrl), payload);
  }

  listProducts(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(this.baseUrl.concat(this.listProductsUrl), { params });
  }

  getProduct(productId: string) {
    return this.http.get((this.baseUrl.concat(this.getProductUrl)).concat(productId));
  }

  createProduct(payload: CreateProductPayload) {
    return this.http.post(this.baseUrl + this.createProductUrl, payload);
  }

  updateProduct(payload: UpdateProductPayload, productId: string) {
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

    return this.http.get(this.baseUrl.concat(this.listFeaturedProductsUrl), { params });
  }

  listCoupons(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(this.baseUrl.concat(this.listCouponssUrl), { params });
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

    return this.http.get(this.baseUrl.concat(this.listOrdersUrl), { params });
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

    return this.http.get(this.baseUrl.concat(this.listUsersUrl), { params });
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

    return this.http.get(this.baseUrl.concat(this.listReviewsUrl), { params });
  }

  getReview(id: number) {
    return this.http.get((this.baseUrl.concat(this.getReviewUrl)).concat(id.toString()));
  }

  listMessages(page: number = 1, limit: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(this.baseUrl.concat(this.listMessagesUrl), { params });
  }

  getMessage(id: number) {
    return this.http.get((this.baseUrl.concat(this.getMessageUrl)).concat(id.toString()));
  }

  geMessagesCount() {
    return this.http.get(this.baseUrl.concat(this.getMessagesCountUrl), { headers: { 'x-show': 'false' } });
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

  getStateWiseRevenue() {
    return this.http.get(this.baseUrl.concat(this.getStateWiseRevenueUrl));
  }

  getDistrictWiseRevenue() {
    return this.http.get(this.baseUrl.concat(this.getDistrictWiseRevenueUrl));
  }
}

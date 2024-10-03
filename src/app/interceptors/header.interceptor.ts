import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  
  /**
   * Intercepts HTTP requests and adds the `withCredentials` flag to the request
   * if the `Content-Type` header is not present.
   *
   * This is useful for scenarios where the server requires credentials to be sent
   * with the request, but the `Content-Type` header is not set.
   *
   * Example:
   * ```
   * import { HTTP_INTERCEPTORS } from '@angular/common/http';
   * import { HeaderInterceptor } from './header.interceptor';
   *
   * @NgModule({
   *   providers: [
   *     { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
   *   ]
   * })
   * export class AppModule {}
   * ```
   */
  @Injectable()
  export class HeaderInterceptor implements HttpInterceptor {

  
    /**
     * Intercepts an HTTP request and adds the `withCredentials` flag if necessary.
     *
     * @param request The HTTP request to intercept.
     * @param next The next handler in the chain.
     * @returns An observable of the HTTP event.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      /**
       * Check if the `Content-Type` header is present in the request.
       * If it's not present, add the `withCredentials` flag to the request.
       */
      if (!request.headers.has('Content-Type')) {
        request = request.clone({
          withCredentials: true
        });
      }
  
      /**
       * Pass the modified request to the next handler in the chain.
       */
      return next.handle(request);
    }
  }
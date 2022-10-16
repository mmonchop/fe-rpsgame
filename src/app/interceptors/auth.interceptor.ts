import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userPassCode = window.btoa(environment.security.apiUsername + ":" + environment.security.apiPassword)
    let authorization = `Basic ${userPassCode}`

    request = request.clone({
      setHeaders: {
        authorization: `${authorization}`,
      },
    });
    
    return next.handle(request);
  }

}

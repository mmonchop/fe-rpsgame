import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public oidcSecurityService: OidcSecurityService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authorization = null

    console.log('INTERCEPTOR')
    if (environment.security.scheme === 'oauth2') {
      this.oidcSecurityService.checkAuth().subscribe(( loginResponse ) => {
        authorization = `Bearer ${loginResponse.accessToken}`
      })
    } else if (environment.security.scheme === 'basic') {
      let userPassCode = window.btoa(environment.security.apiUsername + ":" + environment.security.apiPassword)
      authorization = `Basic ${userPassCode}`
    }
    
    if (authorization !== null) {
      request = request.clone({
        setHeaders: {
          authorization: `${authorization}`,
        },
      });
    }
    
    return next.handle(request);
  }

}

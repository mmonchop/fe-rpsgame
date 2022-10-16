import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent implements OnInit {

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  constructor(
    private router: Router, 
    public oidcSecurityService: OidcSecurityService
    ) {
  }

  ngOnInit() {
    if (environment.security.scheme === 'oauth2') {
      this.oidcSecurityService.checkAuth().subscribe(( loginResponse ) => {
        console.log('app authenticated', loginResponse.isAuthenticated);
      });
    }
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }
}

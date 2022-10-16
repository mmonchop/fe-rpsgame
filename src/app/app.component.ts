import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  selectedLanguage = 'en'

  constructor(
    public translate: TranslateService,
    public oidcSecurityService: OidcSecurityService,
    ) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    if (environment.security.scheme === 'oauth2') {
      this.oidcSecurityService.checkAuth().subscribe(( loginResponse ) => {
        console.log('app authenticated', loginResponse.isAuthenticated);
        if (!loginResponse.isAuthenticated) {
          this.oidcSecurityService.authorize()
        }
      });
    }
  }

  translateLanguageTo() {
    this.translate.use(this.selectedLanguage);
  }

}

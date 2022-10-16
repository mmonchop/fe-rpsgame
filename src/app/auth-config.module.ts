/* eslint-disable arrow-body-style */
import { NgModule } from '@angular/core';
import { AuthModule, LogLevel, OpenIdConfiguration, StsConfigHttpLoader, StsConfigLoader } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

const openIdConfig: OpenIdConfiguration = {
  authority: environment.security.oidc.authority,
  authWellknownEndpointUrl: environment.security.oidc.authWellknownEndpointUrl!,
  redirectUrl: `${window.location.origin}`,
  clientId: environment.security.clientId,
  responseType: environment.security.oidc.responseType,
  scope: environment.security.oidc.scopes,
  postLogoutRedirectUri: `${window.location.origin}`,
  silentRenew: true,
  silentRenewUrl: `${window.location.origin}/silent-renew.html`,
  useRefreshToken: true,
  autoUserInfo: false,
  historyCleanupOff: true,
  maxIdTokenIatOffsetAllowedInSeconds: 600,
  ignoreNonceAfterRefresh: true,
  logLevel: environment.security.oidc.debug ? LogLevel.Error : LogLevel.None,
};

export const httpLoaderFactory = () => {
    return new StsConfigHttpLoader(of(openIdConfig));
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}



export const environment = {
  production: true,
  urlApi: 'http://localhost:4200/api/1.0',
  stompApi: 'http://localhost:4200/websocket-services',
  security: {
    scheme: 'oauth2',
    apiUsername: 'rpsplayer',
    apiPassword: 'password',
    clientId: "b81d2364-cc92-4509-9aaf-937ab827a7c0",
    oidc: {
      authority: "https://login.microsoftonline.com/d9671427-bbc1-42b0-8fac-322502dcff43/v2.0",
      authWellknownEndpointUrl: null,
      scopes: "openid profile email api://b81d2364-cc92-4509-9aaf-937ab827a7c0/user.read",
      responseType: "code",
      debug: true
    }
  }
};

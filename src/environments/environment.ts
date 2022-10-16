export const environment = {
  production: false,
  urlApi: '',
  stompApi: '',
  security: {
    scheme: 'basic',
    apiUsername: '',
    apiPassword: '',
    clientId: '',
    oidc: {
      authority: '',
      authWellknownEndpointUrl: null,
      scopes: '',
      responseType: 'code',
      debug: true
    }
  }
};


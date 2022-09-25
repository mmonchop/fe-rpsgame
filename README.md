# RPSGame
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.4.

## Development server
Run `ng serve --configuration=development` for a dev server. Navigate to `http://localhost:4200/`. 

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Environment Variables required:
Following variables need to be provided in order to access to REST API properly.
development: `/src/environmnents/environment.dev.ts`

| Name | Value | Description |
| ------ | ------ | ------ |
| urlApi | http://localhost:8080/api/1.0 | Base path to access to REST API (http) |
| stompApi | http://localhost:8080/websocket-services | Base path to access to Websockets API |
| apiUsername | rpsplayer | Username used to access REST API (BasicAuth) |
| apiPassword | ****** | Password to access to REST API |


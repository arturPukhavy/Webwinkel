# Webwinkel App
This is a simple web-shop application. The main goal is to delve into frontend, backend and CI/CD technologies while constructing a web based end-to-end application. <br>
The application is being deployed and running in Glitch-platform: https://winkel-app.glitch.me

## Used technology
* FE: Angular (18.1.3)
* BE: Expressjs (Nodejs-based mock API server)

#### Used Angular fetures
* Components (both modules and standalone)
* HTTP Client
* Interceptors
* Routing
* Authentication and route protection
* Observable
* Services
* Dependency injection
* Forms:
  * Template-driven Forms
  * Reactive Forms
* Pipes
## Use cases
TODO

## CI/CD
<img src="img/web-winkel-diagram_deploy.png" width="100%">

## Dev-environment
### Diagram
<img src="img/web-winkel-diagram.png" width="100%">

### Use Angular dev-server proxy
Angular allows to configure CLI dev-server proxy. This is an example of `proxy.conf.json` configuration:
```
{
   "/api/v1/products": {
      "target": "http://localhost:3000",
      "secure": false
   }
}
```
Use the following command to run dev-proxy:
```
ng serve --proxy-config proxy.conf.json
```
This configuration is ONLY for a development purpose, it should not be used in a production environment.

### How to start
The project includes two parts: back-end and front-end. Back-end is an API-server based on Expressjs
#### API server
First the API server should be started
```
cd Webwinkel/BE/express-api
node products-api.js
```
This will start the server on the port 3000

#### Angular app
When API-server is up and running, the FE-app can be staarted:
```
cd Webwinkel/FE/winkel-app
ng serve --proxy-config proxy.conf.json
```
This will start the Anfular app on the localhost port 4200: `http://localhost:4200/`

## Resources
* [Angular docs](https://v17.angular.io/docs)
* [Typescript docs](https://www.typescriptlang.org/docs/)
* [Bootstrap](https://getbootstrap.com/docs/5.3/content/tables/)

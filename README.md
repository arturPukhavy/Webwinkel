# Webwinkel App
This is a simple web-shop application. It includes two parts - Angular front-end application and node-based back-end API server.

## Used technology
* Angular: FE application
* Expressjs: Nodejs-based API server

#### Used Angular fetures
* Components (both modules and standalone)
* HTTP Client
* Routing
* Authentication and route protection
* Observable
* Services
* Dependency injection
* Forms
* Pipes

## Diagram
<img src="img/web-winkel-diagram.png" width="100%">

## Use Angular dev-server proxy
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

## How to start
The project includes two parts: back-end and front-end. Back-end is an API-server based on Expressjs
#### API server
First the API server should be started
```
cd Webwinkel/BE/express-api
node products-api.js
```
This will start the server on the port 3000

#### Angular app
TODO

## Resources
* [Bootstrap](https://getbootstrap.com/docs/5.3/content/tables/)

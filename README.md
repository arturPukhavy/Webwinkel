# Webwinkel App
This is a simple Angular based CRUD application.

## Used technology
* Angular: FE application
* Expressjs: Nodejs-based API server

## Diagram
<img src="img/web-winkel-diagram.png" width="100%">
TODO

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

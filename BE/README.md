# Webwinkel-API 
This is a simple Node.js API for a web-winkel application. 
Express web-framework is used.

## Run API server
```
node webwinkel-api.js
```
## Products API
#### Retrieve a list of all products
```
GET /api/v1/products
```

#### Create a new product
```
POST /api/v1/products
```

#### Update an existing product
```
PUT /api/v1/products/{id}
```

#### Delete a product
```
DELETE /api/v1/products/{id}
```
## Login API
#### Fetch an user by userName and password
(Note: this is just a simple non-secured example. It should not be used in real projects)
```
curl 'http://localhost:3000/api/v1/login' \
--header 'Content-Type: application/json' \
--data '{
    "userName": "max",
    "password": "*******"
}'
```
## Payment API

#### Init Order

#### Pay Order

#### Complete Order


## Invoice API

TODO

## Resources
* [Install express](https://expressjs.com/en/starter/installing.html)

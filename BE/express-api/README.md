# Express-API 
This is a product API based on Express server
TODO

## Run server
```
node products-api.js
```
## Use cases
#### HTTP GET: Get all products
```
curl http://localhost:3000/api/v1/products
```
#### HTTP POST: Add a new product
```
curl 'http://localhost:3000/api/v1/products' \
--header 'Content-Type: application/json' \
--data '{
"naam": "Notebook",
"merk": "Dell",
"voorraad": 34,
"price": 1200.20
}'
```
#### HTTP PUT: Update a product
```
curl --request PUT 'http://localhost:3000/api/v1/products' \
--header 'Content-Type: application/json' \
--data '    {
        "id": 4,
        "naam": "Monitor",
        "merk": "Samsung",
        "voorraad": 21,
        "price": 120.2
}'
```

#### HTTP DELETE: Delete profuct by ID
```
curl --request DELETE 'http://localhost:3000/api/v1/product' \
--header 'Content-Type: application/json' \
--data '    {
        "id": 1
    }'
```

#### HTTP DELETE: Delete All products
```
curl --location --request DELETE 'http://localhost:3000/api/v1/products' \
--data ''
```

## Resources
* [Install express](https://expressjs.com/en/starter/installing.html)

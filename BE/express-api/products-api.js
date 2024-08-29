const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const products = require('./data/products.json');
const users = require('./data/users.json');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//*************************** Products ************** */
//--- HTTP GET: Fetch list of products
 app.get('/api/v1/products', (req, res) => {
  //Get all products from DB

  console.log(`List of products: ${JSON.stringify(products)}`)
  res.json(products)
})

//--- HTTP GET: get product by Id
app.get('/api/v1/product/:id', (req, res) => {
  console.log(`Product id: ` + req.params.id)
  const  product= findObjectById(products, +req.params.id); //Use '+' to convert string->number
  if (product) {
    res.json(product)
  } else {
    console.log('Product not found');
    return res.status(404).json({error: 'Product not found'});
  }
})

//--- HTTP POST: Add a new product
app.post('/api/v1/products', (req, res) => {
  const product = req.body;

  // TODO: Perform any necessary validation if necessary
  const maxId = findMaxId(products);
  product.id = maxId+1;

  products.push(product)
  console.log(`New product has been added: ${JSON.stringify(product)}`)

  //Add intentional latency
  setTimeout((() => { 
    res.json({id: product.id});
  }), 2000)
});

//--- HTTP PUT: Update existing product by id
app.put('/api/v1/products', (req, res) => {
  const product = req.body;

  const  productToUpdate= findObjectById(products, product.id);
  if (productToUpdate) {
    console.log(`Product found: ${JSON.stringify(productToUpdate)}`);
    productToUpdate.naam = product.naam
    productToUpdate.merk = product.merk
    productToUpdate.voorraad = product.voorraad
    productToUpdate.price = product.price
  } else {
    //TODO return an error
    console.log('Product not found');
    return res.status(400).json({error: 'Product not found'});
  }

  console.log(`Product has been updated: ${JSON.stringify(productToUpdate)}`)
  res.json({id: productToUpdate.id});
});

//--- HTTP DELETE: Delete all products
app.delete('/api/v1/products', (req, res) => {
  products.length=0;
  console.log(`All products have been deleted`)
  res.json(products);
});

//--- HTTP Delete: Delete product by id
app.delete('/api/v1/product', (req, res) => {
  const id = req.body.id;
  console.log(`Delete product with id=${id}`)

  if(id==1){
    console.log(`Cannot delete (mock a HTTP400 functional error)`)
    return res.status(400).json({error: 'Product not found'});
  }
  if(id==2){
    console.log(`Cannot delete (mock a HTTP503 Technical error)`)
    return res.status(503).json({error: 'Server not available'});
  }

  const  productToDelete= findObjectById(products, id);
  if (productToDelete) {
    const index = products.indexOf(productToDelete);
    products.splice(index, 1);
  } 
  else {
    //TODO return an error
    console.log('Product not found');
    return res.status(400).json({error: 'Product not found'});
  }
  console.log(`Deleted product: ${JSON.stringify(productToDelete)}`)
  res.json(products);
});

const findObjectById = (array, id) => {
  return array.find(obj => obj.id === id);
};

const findMaxId = (array) => {
  var largest = 0;
  for (let i=0; i < array.length; i++) {
      if (array[i].id > largest) {
          largest = array[i].id;
      }
  }
  return largest;
};

//**************************************** Users API **************************************/
//--- HTTP GET: Fetch all users
app.get('/api/v1/users', (req, res) => {
  //Get all products from DB

  console.log(`List of products: ${JSON.stringify(products)}`)
  res.json(users)
})

//--- HTTP POST: Add a new user
app.post('/api/v1/users', (req, res) => {
  const user = req.body;

  // TODO: Perform any necessary validation if necessary
  // const maxId = findMaxId(products);
  // product.id = maxId+1;

  users.push(user)
  console.log(`New user has been added: ${JSON.stringify(user)}`)

  //Add intentional latency
  setTimeout((() => { 
    res.json({userName: user.userName});
  }), 2000)
})



//**************************************** Login API **************************************/

//--- HTTP POST: Add a new product
app.post('/api/v1/login', (req, res) => {
  const login = req.body;
  const  user= findUserByUserName(users, login.userName);
  
  if (user) {
    console.log(`User: ${JSON.stringify(user)}`)
    if(user.password === login.password){
      const user_clone = structuredClone(user);
      user_clone.password = '******' //Replace a pass on a clone, not on an original object
      res.json(user_clone);
    } else {
      return res.status(401).json({error: 'Password is not correct'});
    }
  } 
  else {
    console.log('User not found');
    return res.status(404).json({error: 'User not found'});
  }
});


const findUserByUserName = (array, uName) => {
  return array.find(user => user.userName === uName);
};

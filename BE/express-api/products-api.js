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
  console.log(`List of users: ${JSON.stringify(users)}`)
  res.json(users)
})

//--- HTTP POST: Add a new user
app.post('/api/v1/users', (req, res) => {
  const user = req.body;

  const existingUser = findUserByEmail(users, user.email);
  console.log(`ExistingUser: ` + (existingUser === undefined));
  if(existingUser === undefined) {
    //Add a new user
    const maxId = findMaxId(users);
    user.id = maxId+1;
    users.push(user)
    console.log(`New user has been added: ${JSON.stringify(user)}`)
    res.json({userName: user.id});
  } else {
    //User with such e-mail already exsis
    console.log('User with such e-mail already exists');
    return res.status(400).json({error: 'User with such e-mail already exists'});
  }
})

//--- HTTP PUT: Add a new user
app.put('/api/v1/users', (req, res) => {
  const user = req.body;
  const existingUser = findUserByEmail(users, user.email);
  if(existingUser === undefined) {
    //User not found
    console.log('User with such e-mail not found');
    return res.status(404).json({error: 'User with such e-mail not found'});
  } else {
    //Update an existing user
    existingUser.firstName = user.firstName
    existingUser.lastName = user.lastName
    existingUser.birthDate = user.birthDate
    existingUser.role = user.role
    existingUser.userName = user.userName
    existingUser.email = user.email //?
    existingUser.address = user.address
    console.log(`User has been updated: ${JSON.stringify(existingUser)}`)
    res.json({userName: user.id});
   }
})

//--- HTTP Delete: Delete user by id
app.delete('/api/v1/user', (req, res) => {
  const id = req.body.id;
  console.log(`Delete user with id=${id}`)

  const  userToDelete= findObjectById(users, id);
  if (userToDelete) {
    const index = users.indexOf(userToDelete);
    users.splice(index, 1);
  } 
  else {
    //TODO return an error
    console.log('User not found');
    return res.status(400).json({error: 'User not found'});
  }
  console.log(`Deleted user: ${JSON.stringify(userToDelete)}`)
  res.json(users);
});

//--- HTTP DELETE: Delete all users
app.delete('/api/v1/users', (req, res) => {
  users.length=0;
  console.log(`All users have been deleted`)
  res.json(users);
});

//**************************************** Login API **************************************/

//--- HTTP POST: Add a new account
app.post('/api/v1/login', (req, res) => {
  const login = req.body;
  const  user= findUserByEmail(users, login.email);
  
  if (user) {
    console.log(`User: ${JSON.stringify(user)}`)
    if(user.password === login.password){
      const user_clone = structuredClone(user);
      user_clone.password = '******' //Replace a pass on a clone, not on an original object
      res.json({
        idToken: 'jwt_token_string',
        userName: user.userName,
        role: user.role,
        expiresIn: 3600
      });
    } else {
      return res.status(401).json({error: 'Password is not correct'});
    }
  } 
  else {
    console.log('User not found');
    return res.status(404).json({error: 'User not found'});
  }
});
const findUserByEmail = (array, email) => {
  return array.find(user => user.email === email);
};

//**************************************** Paymants API **************************************/
app.get('/api/v1/order/init', (req, res) => {
  res.json({orderId: 'ascf-257-xl'});
});
app.post('/api/v1/order/pay', (req, res) => {
  //TODO
  const order = req.body;
  console.log(`Order to pay: ${JSON.stringify(order)}`)
  res.json({paymentStatus: 'payed'});

});
app.post('/api/v1/order/complete', (req, res) => {
  const order = req.body;
  console.log(`Order to complete: ${JSON.stringify(order)}`)
  res.json({orderStatus: 'completed'});
});

//**************************************** Invoice API **************************************/
app.post('/api/v1/invoice/create', (req, res) => {
  const order = req.body;
  console.log(`Create invoice for order: ${JSON.stringify(order)}`)
  res.json({invoiceForOrder: order.orderId});
});
app.post('/api/v1/invoice/send', (req, res) => {
  const order = req.body;
  console.log(`Send invoice for order: ${JSON.stringify(order)}`)
  res.json({invoiceStatus: 'sent'});
});


// Function to perform a deep clone with support for cyclic references (use it when deploying Glitch!)
function structuredClone(obj, hash = new WeakMap()) {
  if (Object(obj) !== obj) return obj; // primitive value
  if (hash.has(obj)) return hash.get(obj); // cyclic reference

  let clonedObj = Array.isArray(obj) ? [] : {};

  hash.set(obj, clonedObj);

  for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = structuredClone(obj[key], hash);
      }
  }

  return clonedObj;
}
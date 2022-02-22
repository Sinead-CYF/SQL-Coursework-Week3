// imports & middleware
const express = require("express");
const app = express();
const { Pool } = require("pg");
app.use(express.json());

// postres pool class - link database
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_ecommerce",
  password: "Sinnyozzy91",
  port: 5432,
});

// root
app.get("/", (req, res) => {
  res.send(
    `Sinead's CYF e-commerce API. <br> <br> Utilising SQL & Node.js <br> <br> Routes to explore: "/customers", "/suppliers", "/products"`
  );
});

/*

  - Add a new POST endpoint `/products` to create a new product.

  - Update the previous GET endpoint `/products` 
   to filter the list of products by name using a 
   query parameter, for example `/products?name=Cup`. 
   This endpoint should still work even if you don't use 
   the `name` query parameter!

  - Add a new POST endpoint `/availability` to create a 
   new product availability (with a price and a supplier id). 
   Check that the price is a positive integer and that both 
   the product and supplier ID's exist in the database, 
   otherwise return an error.

*/

app.get("/products", function (req, res) {
  pool
    .query(
      `
    SELECT prod.product_name, availability.unit_price, suppl.supplier_name
    FROM product_availability AS availability
    JOIN products AS prod
    on prod.id = availability.prod_id
    JOIN suppliers AS suppl
    ON availability.supp_id = suppl.id
    `
    )
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});



/*  
  
  - Add a new GET endpoint `/customers/:customerId/orders` 
    to load all the orders along with the items in the orders 
    of a specific customer. Especially, the following information 
    should be returned: order references, order dates, product names, 
    unit prices, suppliers and quantities.
    
  - Add a new POST endpoint `/customers` to create 
    a new customer with name, address, city and country.

  - Add a new POST endpoint `/customers/:customerId/orders` 
    to create a new order (including an order date, and an order reference) 
    for a customer. Check that the customerId corresponds to an existing 
    customer or return an error.

  - Add a new PUT endpoint `/customers/:customerId` 
   to update an existing customer (name, address, city and country).

  - Add a new DELETE endpoint `/customers/:customerId` to 
    delete an existing customer only if this customer doesn't have orders.

  - Add a new DELETE endpoint `/orders/:orderId` to delete an 
    existing order along with all the associated order items.
     
*/

// GET all customers
app.get("/customers", function (req, res) {
  pool
    .query("SELECT * FROM customers")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// GET customers by ID
app.get("/customers/:customerId", (req, res) => {
  const customerId = parseInt(req.params.customerId);
  const query = `SELECT * FROM customers WHERE id=$1;`;

  if (!Number.isInteger(customerId)) {
    return res.status(400).json({ msg: "Invalid ID" });
  }

  pool
    .query(query, [customerId])
    .then((result) => {
      if (result.rows.length <= 0) {
        res.status(404).json({ msg: `Customer id ${customerId} not found` });
      } else {
        res.json(result.rows);
      }
    })
    .catch((error) => res.status(500).json(error));
});

// server listening
app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

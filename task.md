You need to build a small Order Management System for an e-commerce application.

The goal is not to build a production-ready application. We mainly want to see how you approach the problem, design your data model, write the APIs, connect the frontend with the backend, and handle real-world edge cases.

You are free to use the technologies/frameworks you are comfortable with.

What the application should do

There are two basic parts:

Admin can add products.

A customer can select products and place an order.

Each product should have at least:

Name

Price

Available stock

A customer should be able to create an order with multiple products.

For example, an order might look like this:

{
  "customerName": "Rahul",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}


You need to decide how you want to structure the database/models.

Some important rules

When an order is placed:

All selected products should exist.

The requested quantity should be available in stock.

The order total should be calculated on the backend.

Don't trust the price or total coming from the frontend.

The price at the time of purchase should be preserved in the order.

Stock should be updated after a successful order.

If something goes wrong while creating an order, the data should not be left in an inconsistent state.

For example, if a product costs ₹500 today and its price becomes ₹700 tomorrow, an order placed today should still show ₹500.

Order Status

An order can have one of these statuses:

pending
confirmed
shipped
delivered
cancelled


Create an API to update the order status.

You should also think about which status changes should be allowed.

For example, does it make sense to change a delivered order back to pending?

You don't have to follow any predefined transition rules — just make a reasonable decision and explain it.

Backend

Create APIs for the following operations:

GET    /products
POST   /products

POST   /orders
GET    /orders
GET    /orders/:id

PATCH  /orders/:id/status


Please handle basic:

Request validation

Appropriate HTTP status codes

Error responses

Business rules

You can use an in-memory array if setting up a database takes too much time.

However, even if you use an in-memory store, think about how you would design the models if this were a real application.

Frontend

Create a simple UI where a user can:

See the available products.

Add products to a cart.

Increase/decrease quantity.

See the cart total.

Enter their name.

Place the order.

See the order after it has been created.

See basic loading and error states.

The frontend should use your backend APIs. Avoid hardcoding the order data directly in the frontend.

The UI doesn't need to be fancy. Focus more on functionality and code quality.

Things to Think About

You don't necessarily have to implement every possible edge case, but think about what should happen when:

A product doesn't exist.

A product is out of stock.

Requested quantity is greater than available stock.

The cart is empty.

Quantity is invalid.

Product data is invalid.

Someone tries an invalid order status transition.

The API fails while placing an order.
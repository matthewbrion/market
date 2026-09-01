import bcrypt from 'bcrypt';
import db from "#db/client";
import { createUser } from '#db/queries/users';
import { createProduct } from '#db/queries/products';
import { createOrder, addProductToOrder } from '#db/queries/orders';

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query(`
    TRUNCATE orders_products, orders, products, users
    RESTART IDENTITY CASCADE
    `);
  
  const users = [];
  for (let i = 0; i < 5; i++) {
    const hashedPassword = await bcrypt.hash(`password${i}`, 10);
    const user = await createUser(`user${i}`, hashedPassword);
    users.push(user);
  }

  const products = [];
  const productData = [
    ['Widget', 'A useful widget', 9.99],
    ['Gadget', 'A useful gadget', 19.99],
    ['Gizmo', 'A useful gizmo', 29.99],
    ['Doohickey', 'An essential doohickey', 4.99],
  ];
  for (const [title, description, price] of productData) {
    const product = await createProduct(title, description, price);
    products.push(product);
  }

  const order1 = await createOrder(users[0].id);
  await addProductToOrder(order1.id, products[0].id, 2);
  await addProductToOrder(order1.id, products[1].id, 1);

  const order2 = await createOrder(users[1].id, 'Gift wrap please');
  await addProductToOrder(order2.id, products[2].id, 3);
}

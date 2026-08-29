import db from "#db/client";

export async function createOrder(userId, note = null) {
    const sql = `
    INSERT INTO orders
        (user_id, note)
    VALUES
        ($1, $2)
    RETURNING *
    `;
    const {
        rows: [order],
    } = await db.query(sql, [userId, note]);
    return order;
}

export async function getOrdersByUserId(id) {
  const sql = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

export async function getOrderById(id) {
    const sql = `
    SELECT *
    FROM orders
    WHERE id = $1
    `;
    const { rows: [order] } = await db.query(sql, [id]);
    return order;
}
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
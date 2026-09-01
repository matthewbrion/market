import express from "express";
import getUserFromToken from '#middleware/getUserFromToken';
import usersRouter from '#api/usersRouter';
import productsRouter from '#api/productsRouter';
import ordersRouter from '#api/ordersRouter';

const app = express();
app.use(express.json());
app.use(getUserFromToken);

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message || 'Sorry, something went wrong');
});

export default app;

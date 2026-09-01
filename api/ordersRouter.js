import { Router } from 'express';
import {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    addProductToOrder,
} from '#db/queries/orders';
import { getProductById, getProductsByOrderId } from '#db/queries/products';
import requireUser from '#middleware/requireUser';
import requireBody from '#middleware/requireBody';

const router = Router();

router.post('/', requireUser, requireBody(['date']), async (req, res, next) => {
    try {
        // date is required by contract but not persisted
        // schema uses "CURRENT_DATE"
        const order = await createOrder(req.user.id, req.body.note);
        res.status(201).send(order);
    } catch (e) {
        next(e);
    }
});

router.get('/', requireUser, async (req, res, next) => {
    try {
        const orders = await getOrdersByUserId(req.user.id);
        res.send(orders);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', requireUser, async (req, res, next) => {
    try {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).send('Order not found');
        if (order.user_id !== req.user.id) return res.status(403).send('Forbidden');
        res.send(order);
    } catch (e) {
        next(e);
    }
});

router.post('/:id/products', requireUser, async (req, res, next) => {
    try {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).send('Order not found');
        if (order.user_id !== req.user.id) return res.status(403).send('Forbidden');

        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).send('Product id and quantity are required');
        }

        // createOrder-side inserts don't check FKs,
        // check happens here or bad productId throws am error, not a 400
        const product = await getProductById(productId);
        if (!product) return res.status(400).send('Product does not exist');

        const attach = await addProductToOrder(order.id, productId, quantity);
        res.status(201).send(attach);
    } catch (e) {
        next(e);
    }
});

router.get('/:id/products', requireUser, async (req, res, next) => {
    try {
        const order = await getOrderById(req.params.id);
        if (!order) return res.status(404).send('Order not found');
        if (order.user_id !== req.user.id) return res.status(403).send('Forbidden');
        const products = await getProductsByOrderId(order.id);
        res.send(products);
    } catch (e) {
        next(e);
    }
});

export default router;
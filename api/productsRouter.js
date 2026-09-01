import { Router } from 'express';
import { getAllProducts, getProductById } from '#db/queries/products';
import { getOrdersByProductId } from '#db/queries/orders';
import requireUser from '#middleware/requireUser';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.send(products);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await getOrdersByProductId(req.params.id);
        if(!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (e) {
        next(e);
    }
});

router.get('/:id/orders', requireUser, async (req, res, next) => {
    try {
        const product = await getOrdersByProductId(req.params.id);
        if(!product) return res.status(404).send('Product not found');
        const orders = await getOrdersByProductId(product.id, req.user.id);
        res.send(orders);
    } catch (e) {
        next(e);
    }
});

export default router;
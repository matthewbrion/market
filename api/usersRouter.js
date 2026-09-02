import { Router } from 'express';
import bcrypt from 'bcrypt';
import { createUser, getUserByUsername } from '#db/queries/users';
import { createToken } from '#utils/jwt';

const router = Router();

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(username, hashedPassword);
        const token = createToken({ id: user.id });
        res.status(201).send(token);
    } catch (e) {
        next(e);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const user = await getUserByUsername(username);
        if (!user) return res.status(401).send('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).send('Invalid credentials');
        const token = createToken({ id: user.id });
        res.send(token);
    } catch (e) {
        next(e);
    }
});

export default router;
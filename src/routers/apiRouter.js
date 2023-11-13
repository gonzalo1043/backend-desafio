import { Router } from "express";
import { ProductManager } from "../../services/ProductManager.js";
import { PRODUCTS_JSON } from "../config.js";
import express from 'express'

export const apiRouter = Router()
apiRouter.use(express.json())

const pm = new ProductManager(PRODUCTS_JSON)

apiRouter.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit);
    try {
        const products = await pm.getProducts({ limit });
        res.json(products);
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
});
apiRouter.get('/products/:id', async (req, res) => {
    try {
        const productosId = parseInt(req.params['id']);
        const productWithId = await pm.getProductById(productosId);
        res.json(productWithId);
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
});


apiRouter.post('/products', async (req, res) => {
    try {
        const body = req.body;
        await pm.addProduct({ ...body });
        req['io'].sockets.emit('products', await pm.getProducts())
        res.json({status: 'ok'})
    } catch (error) {
        res.status(400).json({ errorMessage: error.message });
    }
});

apiRouter.delete('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id)
        await pm.deleteProducts(productId)
        req['io'].sockets.emit('products', await pm.getProducts())
        res.json({status: 'ok'})
    } catch (error) {
        res.status(400).json({ errorMessage : error.message})
    }
})

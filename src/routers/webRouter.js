import { Router } from "express";
import { ProductManager } from "../../services/ProductManager.js";
import { PRODUCTS_JSON } from "../config.js";

export const webRouter = Router()

const pm = new ProductManager(PRODUCTS_JSON)
const products = await pm.getProducts()
webRouter.get('/', async (req, res) => {

    res.render('home', {
        titulo: 'home',
        hayProductos: products.length > 0,
        products})
})

webRouter.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        titulo: 'RealTimeProducts',
        hayProductos: products.length > 0,
        products })
})

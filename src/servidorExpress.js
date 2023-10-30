import express from 'express'
import { ProductManager } from './ProductManager.js'
import { PORT, PRODUCTS_JSON } from './config.js'

const productManager = new ProductManager(PRODUCTS_JSON)

const app = express()

app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit)
    try {
        const products = await productManager.getProducts({limit})
        res.json(products)
    } catch (error) {
        res.json({
            status:'error',
            message: error.message
        })
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const productosId = parseInt(req.params['id'])
        const productWithId = await productManager.getProductById(productosId)
        res.json(productWithId)
    } catch (error) {
        res.json({
            status:'error',
            message: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log('Conectada al puerto 8080')
})
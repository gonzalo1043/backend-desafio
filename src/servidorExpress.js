import express from 'express'

import { ProductManager } from './ProductManager'

const productManager = ProductManager({ruta: 'products.json'})

const app = express()


app.get('/productos', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.json(products)
    } catch (error) {
        res.json({
            status:'error',
            message: error.message
        })
    }
})

app.get('/productos/:id', (req, res) => {
    const productosId = parseInt(req.params['id'])
    res.json({productos : productManager.getProductById(productosId)})
})

app.listen(8080, () => {
    console.log('Conectada al puerto 8080')
})
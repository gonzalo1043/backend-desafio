import express from 'express'

import { PORT, PRODUCTS_JSON } from './config.js'
import { ProductManager } from '../services/ProductManager.js'

import { webRouter } from './routers/webRouter.js'
import { apiRouter } from './routers/apiRouter.js'

import { engine } from 'express-handlebars'

import {Server as IOServer} from 'socket.io'



export const app = express()

const pm = new ProductManager(PRODUCTS_JSON)


app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')


const server = app.listen(PORT, () => {
    console.log('Conectada al puerto 8080')
})

const ioServer = new IOServer(server)

ioServer.on('connection', async socket => {
    console.log('cliente conectado:', socket.id)
    socket.emit('productos', await pm.getProducts())

    socket.on('nuevoProducto', async producto => {
        await pm.addProduct(producto)
        ioServer.sockets.emit('productos', await pm.getProducts())
    })
})

app.use((req, res, next) => {
    req['io'] = ioServer
    next()
    })

app.use(express.json())
app.use('/static', express.static('./static'))

app.use('/', webRouter)
app.use('/api', apiRouter)








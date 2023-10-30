import fs from 'fs/promises'
import { Product } from './Product.js';
import { PRODUCTS_JSON } from './config.js';

const ruta = PRODUCTS_JSON

export class ProductManager {
    #products 

    constructor() {
        this.ruta = ruta
        this.#products  = []
    }

    async init() {
        try {
            await this.#leerProducto()
        } catch (error) {
            await this.#escribirProductos()
        }
    }

    #generarNuevoId() {
        if (this.#products.length > 0 ) {
            return this.#products[this.#products.length - 1].id + 1
        } else {
            return 1
        }
    } 

    async #leerProducto() {
        const contenido = await fs.readFile(this.ruta, 'utf-8')
        this.#products = JSON.parse(contenido)
    }
    async #escribirProductos() {
        await fs.writeFile(this.ruta, JSON.stringify(this.#products, null, 2))
    }

    async modificarProductos(id, prodData) {
        await this.#leerProducto()
        const index = this.#products.findIndex (p => p.id === id)
        if (index !== -1) {
            const nuevoProd = new Product({id, ...this.#products[index], ...prodData })
            this.#products[index] = nuevoProd
            await this.#escribirProductos()
            return nuevoProd
        } else {
            throw new Error ('error al actualizar: producto no encontrado')
        }
    }

    async deleteProducts(id) {
        await this.#leerProducto()
        const index = this.#products.findIndex(p => p.id === id)
        if (index !== -1) {
            const arrayConLosBorrados = this.#products.splice(index, 1)
            await this.#escribirProductos()
            // return arrayConLosBorrados[0]
        } else {
            throw new Error ('error al borrar: producto no encontrado')
        }
    }


    async addProduct({title, description, price, thumbnail, code, stock}) {
        await this.#leerProducto()

        const id = this.#generarNuevoId()
        
        const codeExist = this.#products.find( p => p.code === code)
        
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error ('Los campos son obligatorios')
        }
        
        if (codeExist) {
            throw new Error ('El codigo esta repetido')
        }

        const product = new Product ({id, title, description, price, thumbnail, code, stock} )

        this.#products.push(product)
        await this.#escribirProductos()
        return product
    }

    async getProducts(query = {}) {
        await this.#leerProducto()
        
        if(query.limit) {
            return this.#products.filter (p => p.id <= query.limit)
            }    
            return this.#products  
        } 

    async getProductById (id) {
        await this.#leerProducto()
        const busqueda = this.#products.find(p=> p.id === id)
        if (!busqueda) throw new Error ('El producto no existe')
        return busqueda
    }
}



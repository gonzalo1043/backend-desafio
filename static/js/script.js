const socket = io()

const ulProducts = document.querySelector('#products')
const beforeAdding = document.querySelector('#beforeAdding')

socket.on('products', products => {
    if (ulProducts) {
        beforeAdding.innerHTML = ''
        ulProducts.innerHTML = ''
        for (const product of products) {
            const liProduct = document.createElement('li')
            liProduct.innerHTML = `id: ${product.id}. Title: ${product.title}. Description: ${product.description}. Price: ${product.price}. Thumbnail: ${product.thumbnail}. Code: ${product.code} Stock: ${product.stock}  ` 
            ulProducts.appendChild(liProduct)
        }
    }
})

var express = require('express')
var cors = require('cors')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')

// GraphQL schema
var schema = buildSchema(`
    type Query {
        product(id: Int!): Product
        products: [Product]
    },
    type Product {
        id: Int
        title: String
        price: Float
        inventory: Int
    }
`)

var productData = [
    {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
    {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
    {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5},
    {"id": 4, "title": "Iphone XS", "price": 29.99, "inventory": 8}
]

var getProduct = function(args) { 
    var id = args.id
    return productData.filter(product => {
        return product.id == id
    })[0]
}

var root = {
    product: getProduct,
    products: productData
}

var app = express()

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'))
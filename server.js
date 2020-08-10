var express = require('express')
var cors = require('cors')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')

// GraphQL schema
var schema = buildSchema(`
    type Query {
        todo(id: Int!): Todo
        todos(status: String): [Todo]
    },
    type Mutation {
        updateTodo(id: Int!): Todo
    },
    type Todo {
        id: Int
        text: String
        completed: Boolean
    }
`)

var todoData = [
    {
        id: 1,
        text: 'The Complete Node.js Developer Course',
        completed: true
    },
    {
        id: 2,
        text: 'Node.js, Express & MongoDB Dev to Deployment',
        completed: false
    },
    {
        id: 3,
        text: 'JavaScript: Understanding The Weird Parts',
        completed: false
    }
]

var getTodo = function(args) { 
    var id = args.id
    return todoData.filter(todo => {
        return todo.id == id
    })[0]
}

var getTodos = function(args) {
    if (args.status === 'complete') {
        return todoData.filter(todo => todo.completed === true)
    } else if (args.status === 'active') {
        return todoData.filter(todo => todo.completed === false)
    } else {
        return todoData
    }
}

var updateTodo = function({id}) {
    todoData.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed
            return todo
        }
    })
    return todoData.filter(todo => todo.id === id) [0]
}

var root = {
    todo: getTodo,
    todos: getTodos,
    updateTodo: updateTodo
}

var app = express()

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'))
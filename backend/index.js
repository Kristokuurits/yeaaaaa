const app = require('express')()
const host = 'localhost'
const port = 8080
const swaggerDoc = require("./docs/swagger.json")
const swaggerUi = require("swagger-ui-express")

const hugs = [
    {id: 1, name: "Short", price: 20.50},
    {id: 2, name: "Medium", price: 50.20},
    {id: 3, name: "Long", price: 70.00}
]

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get("/", (req, res) => {
    res.send(`Server running. Docs at <a href='http://${host}:${port}/docs'> /docs</a>`)
})

app.get("/hugs", (req, res) => {
    res.send(hugs.map(({id,name}) => {
         return {id, name}
    }))
})

function createID() {
    const max = hugs.reduce((prev, current) => (prev.id > current.id) ? prev : current, 1)
    return max + 1;
}


app.post("/hugs", (req, res) => {
    if(!req.body.name || req.body.name.trim().lenght === 0) {
        return res.status(400).send({error: "Missing required field 'name'"})
    }
    const newPrice = parseFloat(req.body.price);
    hugs.push({
            id: createId(),
            name: req.body.name,
            price: isNaN(newPrice) ? null : newPrice
        }
    )
    res.send(hugs)
})


app.get("/hugs/:id", (req, res) => {
    const idNumber = parseInt(req.params.id)
    if (isNaN(idNumber)) {
        return res.status(400).send({error: `ID must be a whole number: ${req.params.id}`})
    }
    const hug = hugs.find(g => g.id === idNumber)
    if (!hug) {
        return res.status(404).send({error: `Hug Not Found!`})
    }
    res.send(hug)
})



app.listen(port, () => {
    console.log(`API up at : http:/localhost:${port}`)
})
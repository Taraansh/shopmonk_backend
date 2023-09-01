import express from "express"

//rest object
const app = express()

//rest api
app.get('/', (req, res)=>{
    res.send({message: "Welcome to ShopMonk app"})
})

//PORT
const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
  })
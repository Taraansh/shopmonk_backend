import express from "express"
import dotenv from "dotenv"

//Configure env
dotenv.config();

//rest object
const app = express()

//rest api
app.get('/', (req, res)=>{
    res.send({message: "Welcome to ShopMonk app"})
})

//PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
  })
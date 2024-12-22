
const express = require("express");
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');

//initialize teh env variable
dotenv.config();

//initialize the app

const app = express();
const PORT = process.env.PORT

//middleware to parse teh json
app.use(bodyparser.json());

//step 1) mongodb connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("mongo is connected successfully"))
.catch((error) => console.log("error", error));


//step 2) define teh schema
const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true}
});

const Items = mongoose.model("Item", itemSchema);

// do the api call
app.get('/api/items', async(req, res) => {
    try{
        const items = await Items.find(); // to get the data
        res.status(200).json(items);
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

//3) post the new item

app.post("/api/items", async(req, res) => {
    try{
        const newItem = new Items(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

app.listen(PORT, () =>{
    console.log(`server is running at the port number http://localhost:${PORT}`)
})
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.json())
const path = require("path")

const db = require("./db");
const collection = "todo"


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/getTodo", (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err,documents)=> {
        if(err) {
            console.log(err)
        }else {
            res.json(documents)
        }
    })
})

app.put("/:id", (req,res)=> {
   
    const todoID = req.params.id;
    const userInput = req.body
    db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(todoID)},{$set: {todo: userInput.todo}}, {returnOriginal: false}, (err, result) => {
        if(err){
            console.log(err)
        }else {
            res.json(result)
        }
    })
})

app.post("/",(req, res, next)=> {
    const userInput = req.body

    Joi.validate(userInput, schema, (err, result) => {
        if(err) {
            const err = new Error("Invalid Input")
            err.status = 400
            next(err)
        }else {
            db.getDB().collection(collection).insertOne(userInput, (err, result) => {
                if(err) {
                    console.log(err)
                }
                else {
                    res.json({result})
                }
            })
        }
    })
    

})
app.delete("/:id", (req, res) => {
    const todoID = req.params.id

    db.getDB().collection(collection).findOneAndDelete({_id: db.getPrimaryKey(todoID)}, (err, result) => {
        if(err) {
            console.log(err)
        }else {
            res.json(result)
        }
    })
})



db.connect((err) => {
    if(err) {
        console.log("unable to connect to database");
        process.exit(1)
    }else {
        app.listen(3000, () => {
            console.log("conected to database, app listening to port 3000")
        })
    }
})
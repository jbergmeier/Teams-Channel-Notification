const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
require("dotenv").config()
const {teams_call} = require("./ext_requests/teams_request")

const port = process.env.PORT || 1337
const app = express()
app.use(bodyParser.json())

// Routes
app.get("/", async (req, res, next) => {
    res
    .status(200)
    .json({message: "ok"})
})

app.post("/", async(req, res, next) => {
    if(req.body['baseUrl']) {
        baseUrl = req.body['baseUrl']
    } else{
        res
            .status(400)
            .json({
                message: "Base URL is missing"
            })
        return
    }
    const title = req.body['title'] ? req.body['title'] : 'n/a'
    const subtitle = req.body['subtitle'] ? req.body['subtitle'] : 'n/a'
    const description = req.body['description'] ? req.body['description'] : 'n/a'
    const level = req.body['level'] ? req.body['level'] : 'n/a'
    const image = req.body['image'] ? req.body['image']: 'n/a'
    const type = req.body['type'] ? req.body['type'] : 'n/a'

    // check if X-Auth Key is correct // basic auth --> Stored in env and azure key vault later
    console.error("req.headers")
   if(req.headers['x-auth'] != process.env.XAUTH) {
        res
        .status(400)
        .json({
            message: "Auth is not correct!"
        })
        console.error("Auth is not correct!")
        return
    }   
    
    try {
        await teams_call({ subtitle, title, level, description, type, baseUrl, image}, (callback) => {
            res
            .status(callback.statusCode ? callback.statusCode : 200)
            .json(callback ? callback : {message: "ok"})
        })
    }catch(e)
    {
        next(e)
    }
})


// Error Handling
app.use((err, req, res, next) => {
    console.error('StackTrace: ' + err.stack);
  
    res.status(500).json({
      message: 'An error has occured!',
      error: err,
      stack: process.env.NODE_ENV == 'development' ? err.stack : 'n/a',
    });
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// Generates API Key
// console.log(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
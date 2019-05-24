const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const stringUtil = require('StringUtils.js');
var cors = require('cors')


const INGREDIENTS_TABLE = process.env.INGREDIENTS_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};


app.use(cors())

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('My Application for Ingredients')
})

// Get Ingredient fuzzy logic endpoint
app.get('/fuzzy-search/:userInput', function (req, res) {

    var ingredientKey = req.params.userInput.toHashKey();
    console.log("Outside this" + ingredientKey);
    var params = {
      TableName: INGREDIENTS_TABLE,
      Key: {
          ingredientName: ingredientKey,
      },
    }
  
    dynamoDb.get(params, (error, result) => {
      if (error) {
        
        console.log(error);
        res.status(400).json({ error: 'Could not get ingredient' });
      }
      if (result.Item) {
        const {text, tags} = result.Item;
        res.json({ text, tags });
    } else {
        const ingredientKeys = req.params.userInput.toHashKey().getVariations();
        console.log("Inside this" + ingredientKeys);
        for (var i = 0; i < ingredientKeys.length; i++) {
            params = {
            TableName: INGREDIENTS_TABLE,
            Key: {
                ingredientName: ingredientKeys[i],
            },
            }
        
            dynamoDb.get(params, (error, result) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error: 'Could not get ingredient' });
            }
            if (result.Item) {
                const {text, tags} = result.Item;
                res.json({ text, tags });
            } else {
            res.status(404).json({ });
            }
            });
        }
      //res.status(404).json({ });
      }
    });
  })


// Get Ingredient endpoint
app.get('/ingredient/:ingredientName', function (req, res) {
  const params = {
    TableName: INGREDIENTS_TABLE,
    Key: {
        ingredientName: req.params.ingredientName,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get ingredient' });
    }
    if (result.Item) {
        console.log(result.Item);
        const {ingredientName, text, tags} = result.Item;
        res.json({ingredientName : { text, tags }});
    } else {
      res.status(404).json({ error: "Ingredient not found" });
    }
  });
})

// Create Ingredient endpoint
app.post('/add-ingredients', function (req, res) {
    console.log("body"+req.body);
    var ingredient_keys = Object.keys(req.body);
    for (var i = 0; i < ingredient_keys.length; i++) {
        var ingredientName = ingredient_keys[i];
        var {text,tags} = req.body[ingredientName]
        console.log("The text name is "+req.body[ingredientName]);
        //console.log("The tags name is "+tags);
        if (typeof ingredientName !== 'string') {
            res.status(400).json({ error: '"ingredientName" must be a string' });
        } 
        else if (typeof text !== 'string') {
            res.status(400).json({ error: '"text" must be a string' });
        }

        const params = {
            TableName: INGREDIENTS_TABLE,
            Item: {
            ingredientName: ingredientName,
            text: text,
            tags: tags,
            },
        };

        dynamoDb.put(params, (error) => {
            if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not create ingredient' });
            }
            res.json({ ingredientName : {text: text , tags : tags} });
        });
  }
})

// // Create User endpoint
// app.post('/add-ingredients', function (req, res) {
   
//   const {ingredientName,text,tags} = req.body;

//   if (typeof ingredientName !== 'string') {
//     res.status(400).json({ error: '"ingredientName" must be a string' });
//   } 
//   else if (typeof text !== 'string') {
//     res.status(400).json({ error: '"text" must be a string' });
//   }

//   const params = {
//     TableName: INGREDIENTS_TABLE,
//     Item: {
//       ingredientName: ingredientName,
//       text: text,
//       tags: tags,
//     },
//   };

//   dynamoDb.put(params, (error) => {
//     if (error) {
//       console.log(error);
//       res.status(400).json({ error: 'Could not create ingredient' });
//     }
//     res.json({ ingredientName : {text: text , tags : tags} });
//   });
// })

module.exports.handler = serverless(app);
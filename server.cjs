const express = require('express') // fetching the express and storing in a express variable
const bodyParser = require('body-parser') 
const {connectToDb, getDb} = require('./db.cjs') //importing required functions
const app = express() // creating a server application
app.use(express.static(__dirname)) // in current dir the files are accessed
app.use(bodyParser.json())
//connecting db
const {ObjectId} = require('mongodb')
let db
connectToDb(function(error) {
    if(!error) {
        // Starting the server
        app.listen(8000)
        console.log('Listening on port 8000...')
        db = getDb()
    } else {
        // Server would not start
        console.log(error)
    }
})
app.post('/add-entry', function(request, response) {
    //console.log(request.body)
    db.collection('ExpenseData').insertOne(request.body).then( function() {
        response.status(201).json( {
            'status' : 'data successfully entered'
        })
    }).catch(function(error) {
        response.status(500).json({
            'status' : 'error'
        })
    })
})

//getting all the entries from the db
app.get('/get-details',(req,res) => {
    const entries =[];
    db.collection('ExpenseData').find().forEach(entry => entries.push(entry)).then(()=> {
        res.status(200).json(entries)
    }).catch((error)=> {
        res.status(500).json({
            "status" : "error"
        })
    })
})
app.delete('/delete-data',function(request,response){
    if(ObjectId.isValid(request.body.id)){
    db.collection('ExpenseData').deleteOne({
      
        _id: new ObjectId(request.body.id)//objectId-it is used mongodb
    }).then(function(){
        response.status(201).json({
            
              'status':'success'
            

        }) }).catch(function(error){
            response.status(404).json(
            {
                "error": "error"
            })
       })
}
else{
    response.status(201).json({
            
        'status':'ObjectId not found'
    })
}})
app.patch('/update-data',function(request,response){
    if(ObjectId.isValid(request.body.id)){
        db.collection('ExpenseData').updateOne(
            {_id:new ObjectId(request.body.id)},
            {$set:request.body.data}

        ).then(()=>{
            response.status(200).json({
                'status':'success'
            })
        }).catch(function(error){
            response.status(404).json({
            'status':"error"
        })
        })
    }
    else{
        response.status(201).json({
            
            'status':"ObjectId not found"
        })

    }
})





// const expenses = []; // Array to store expenses

// app.post('/add-expense', function (request, response) {
//   const expenseDetails = request.body;
//   expenses.push(expenseDetails);
//   console.log(expenseDetails); // Log the details in the terminal
//   response.status(200).json({
//     message: 'Expense added successfully',
//     expenses: expenses,
//   });
// });

// app.listen(8000);
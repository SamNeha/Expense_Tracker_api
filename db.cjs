const {MongoClient} = require('mongodb')
 let db
function connectToDb(startServer) {
    MongoClient.connect('mongodb+srv://Neha:250103@cluster0.owt0jmk.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then(function(client) {
     db= client.db() 
     return startServer()
    }).catch(function(error) {
        return startServer(error)

  })
 
}
function getDb() 
{
return db
}
module.exports = {connectToDb, getDb}
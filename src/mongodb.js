// const { MongoClient, ObjectId } = require("mongodb");

// Connection URI
// const uri = 'mongodb://127.0.0.1:27017';

// Create a new MongoClient
// const client = new MongoClient(uri);

// Database Name
// const dbName = 'task-manager';

// const inserOneUser = async () => {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     console.log("Connected successfully to server");
//     const db = client.db(dbName);
//     // collection name
//     const collection = db.collection('users');
//     //insert collection
//     const insertResult = await collection.insertOne({ name: 'thaai' })
//     console.log('Inserted documents =>', insertResult);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// inserOneUser().catch(console.error);


// const updateOneUser = async () => {
//   try {
//     await client.connect()
//     console.log("Connected successfully to server")
//     let db = client.db(dbName)
//     let collection = db.collection('users')
//     let updatUser = await collection.updateOne(
//       { _id: new ObjectId('61cab46c68de64e03cdf3c1b') },
//       { $set: { age: 45, address: 'Abul Khasib - Basra', phoneN: '000-0000' } },
//     )
//     console.log(updatUser)
//   } catch (e) { console.log(e) } finally { await client.close() }
// }

// updateOneUser()


// const updateManyTasks = async () => {
//   try {
//     await client.connect()
//     console.log('Connected successfully to server')
//     let db = client.db(dbName)
//     let collection = db.collection('tasks')
//     let updateTask = await collection.updateMany(
//       { completed: false },
//       { $set: { completed: true } }
//     )
//     console.log(updateTask.modifiedCount)

//   } catch (e) { console.log(e) } finally { await client.close() }
// }

// updateManyTasks()


const deleteOneTask = async () => {
  try {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection('tasks')
    const deleteTask = await collection.deleteOne({ _id: ObjectId('61c9810d725bfae80db3c4b5') })
    console.log(deleteTask)

  } catch (e) { console.log(e) } finally { await client.close() }
}

deleteOneTask()
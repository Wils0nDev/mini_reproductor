const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/mini_reproductors';
const port = 3977

const app  = require('./app');
mongoose.Promise = global.Promise;
mongoose.connect(db ,{useNewUrlParser: true, useUnifiedTopology: true}, (err,res) => {

    if(err){
      throw err
    }else{
      console.log('conexion ok');

     
      
      app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
      })
      
    }
});

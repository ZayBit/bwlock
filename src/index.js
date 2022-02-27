const express = require('express')
const app = express()
const path = require('path')
// -----
app.set('port',4040)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
// -----
app.engine('html',require('ejs').renderFile)
// -----
// static files
app.use(express.static(path.join(__dirname,'public')));
// routes
app.use('/',require('./routes/index'))
// listening the server
app.listen(app.get('port'),()=>{
    console.log(`server on: http://localhost:${app.get('port')}`);
})
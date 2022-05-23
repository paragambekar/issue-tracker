const express = require('express');
const app = express();
const port = 9000;
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);

app.use('/', require('./routes/index'));

app.set('view engine', 'ejs');
app.set('views' , './views');

app.listen(port, function(error){
    if(error){
        console.log(`Error in running server on port ${port}`);
        return;
    }

    console.log(`Server is running on port ${port}`);
});



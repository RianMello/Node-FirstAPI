require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bookRouter = require('./routers/book.routes');
const loginRouter = require('./routers/login.routes');

//ENUM
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rotas
app.use('/books', bookRouter);
app.use('/auth', loginRouter);


// mandar o servidor rodar
// mongodb+srv://Rian_de_Mello:<password>@cluster0.lrdzsbx.mongodb.net/?retryWrites=true&w=majority
mongoose.set('strictQuery', true);

mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.lrdzsbx.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(8000, () => console.log("#Conctado e Operando!#"))
  })
  .catch(err => console.log(err))
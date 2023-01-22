const router = require('express').Router();
const Book = require('../models/Book.js');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();

    return res.status(200).json(books);
  } catch(err) {
    console.log(err);
    return res.status(404).json({message: "O banco provavelmente está vazio!"})
  }
});

router.get('/:id', async (req, res)=> {
  const { id } = req.params;
  try {
    const book = await Book.findOne({_id: id});

    return res.status(200).json(book);
  } catch(err){
    console.log(err);
    return res.status(404).json({ message: "Livro não encontrado!"})
  }
})

router.post('/', async (req, res) => {
  const { title, author, publishedAt, price, rental } = req.body;

  // Verficação de campos null.
  if(!title || !author || !publishedAt || !price || !rental) {
    return res.status(422).json({message: "Todos os campos são obrigatórios!"})
  }

  const book = {
    title,
    author,
    publishedAt,
    price,
    rental
  }

  try{
    await Book.create(book)

    return res.status(201).json({message: "Livro cadastrado!"})
  }
   catch (error) {
    res.status(500).json({error: error})
  }

  
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const {title, author, publishedAt, price, rental} = req.body;

  const book = {
    title,
    author,
    publishedAt,
    price,
    rental,
  }

  try {
    await Book.updateOne({_id: id}, book);
    return res.status(200).json({message: "Livro atualizado!"});
  } catch(err){
    console.log(err);
    return res.status(500).json({error: err});
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const book = Book.findOne({_id: id});
  if(!book) {
    return res.status(422).json({message: "Livro não encontrado!"})
  }

  try {
    await Book.deleteOne({_id: id});
    return res.status(200).json({message: "Livro deletado!"})
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Não foi possível excluir o livro."})
  }
})

module.exports = router;
const router = require('express').Router();
const Employees = require('../models/Employees');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Private Route
router.get('/employee/:id', checkToken, async (req, res) => {
  const { id } = req.params;

  const employeeFound = await Employees.findById(id, "-password");

  if(!employeeFound) {
    return res.status(404).json({message: "Funcionário não encontrado!"})
  }

  return res.status(200).json({employeeFound})
});

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token){
    return res.status(401).json({message: "Acesso negado!"})
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    return res.status(401).json({message: "Token inválido!"})
  }
}

router.get('/', async (req, res) => {
  try {
    const logs = await Employees.find();
    if(logs.length == 0) {
      return res.status(422).json({message: "A base de funcionários está vazia"})
    }
    return res.status(200).json(logs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password, position, confirmPassword} = req.body;

  //check null values
  if(!name || !email || !password || !position){
    return res.status(422).json({message: "Todos os campos são obrigatórios"})
  }

  //check if password is valid
  if(password !== confirmPassword) {
    return res.status(422).json({message: "As senhas não conferem"})
  }

  //check if log already exist
  const alreadyExist = await Employees.findOne({email: email});

  if(alreadyExist){
    return res.status(422).json({message: "Email já cadastrado, tente novamente"})
  }

  //create encrypted password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  
  //create new Log
  const employee = new Employees({
    name,
    email,
    password: passwordHash,
    position,
  });

  try{
    await employee.save();

    return res.status(201).json({message: "Funcionario registrado com sucesso!"})
  }
   catch (error) {
    res.status(500).json({error: error})
  }
  
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  //check null values
  if(!email || !password){
    return res.status(422).json({message: "Email e Senha precisam ser preenchidos"})
  }

  //check if log already exist
  const employee = await Employees.findOne({email: email});

  if(!employee){
    return res.status(404).json({message: "Funcionário não encontrado!"})
  }
  
  //check if password match
  const checkPassword = await bcrypt.compare(password, employee.password)

  if(!checkPassword) {
    return res.status(422).json({message: "Senha Incorreta"})
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign(
      {
        id: employee._id,
      },
      secret,
    )

    return res.status(200).json({message: "Login Realizado!", token})
  } catch (err) {
    console.log(err)
    res.status(500).json({error: err})
  }
});

router.delete('/:email', async (req, res) => {
  try {
    await Employees.deleteMany({email: req.params.email})
    return res.status(200).json({message: "Logins apagados!"})
  } catch (err) {
    res.status(500).json({error: err})
  }
})
module.exports = router;
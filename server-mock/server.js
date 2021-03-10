/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create();
const router = jsonServer.router('./db.json');

const databaseRecords = JSON.parse(fs.readFileSync('./db.json', 'UTF-8'));
const usersData = databaseRecords.users;

server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
const SECRET_KEY = '123456789';
const expiresIn = '1h';

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

function isAuthenticated({email, password}){
  return usersData.findIndex(user => user.email === email && user.password === password) !== -1
}

server.post('/auth/login', (req, res) => {
  const {email, password} = req.body
  if (isAuthenticated({email, password}) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    return res.status(status).json({status, message})
  }
  const access_token = createToken({email, password})
  return res.status(200).json({access_token})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization?.split(' ')[0] !== 'Bearer') {
    const status = 401;
    const message = 'Bad authorization header'
    return res.status(status).json({status, message})
  }

  try {
    verifyToken(req.headers.authorization.split(' ')[1])
    next()
  } catch (err) {
    const status = 401;
    const message = 'Error: access_token is not valid'
    res.status(status).json({status, message})
  }
});

server.use(router);

server.listen(3001, () => {
  console.log('Run Auth API Server')
})
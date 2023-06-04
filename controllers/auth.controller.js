const User = require('../models/user.model')
let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'goliylox';

const generateAccessToken = (id, username, password) => {
    const payload = {
        id,
        username,
        password
    }
    return jwt.sign(payload, secretKey, {expiresIn: "24h"})
}

exports.registration = async (req, res) => {
    try {
            const token = req.cookies.token;
            res.render('../views/auth/registration.hbs', { isLoggedIn: token });  
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
}

exports.login = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.render('../views/auth/login.hbs', { isLoggedIn: token });  
        }
        else{
            res.send('Пользователь уже авторизован!')
        }
        
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
  }

exports.doLogin = async(req, res) => {
    try {
        const { username, password } = req.body;
        const fetchuser = await User.findOne({ username });
        if(!fetchuser){
            return res.send(`Пользователь ${username} не найден!`)
        }
        const validPassword = bcrypt.compareSync(password, fetchuser.password);
        if(!validPassword){
            return res.send(`Введён неверный пароль!`)
        }
        const token = generateAccessToken(fetchuser._id, username)
        res.cookie('token' , token, { httpOnly: true });
        res.redirect('/')
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
}

exports.doLogout = async(req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/')
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
}

exports.doRegister = async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const candidate = await User.findOne({username})
        if(candidate){
            return res.status(400).send('Пользователь с таким именем уже существует!')
        }
        const hashPassword = bcrypt.hashSync(password, 6);
        const fetchuser = new User({ username, password: hashPassword, email, progress: 0 });
        await fetchuser.save();
        const token = generateAccessToken(fetchuser._id, username)
        await res.cookie('token' , token, { httpOnly: true });
        res.redirect('/')
      } catch (err) {
        console.error(err);
        console.log(req.body);
        res.status(500).send('Server Error');
      }
}

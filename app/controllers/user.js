const userModel = require('../models/user');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const config = require("./../../config/config");

module.exports = {
 create: (req, res, next) => {  
  userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, (err, result) => {
      if (err) 
        res.status(500).send({message: `Error al guardar en la base de datos: ${err} `})
      else
      res.status(200).send({status: "success", message: "User added successfully!!!", data: result})  
    });
 },

  authenticate: (req, res, next) => {
    userModel.findOne({email:req.body.email}, (err, userInfo) => {
      if (err) {
        res.status(500).send({message: `Error al realizar la petición: ${err} `})
      } else {
        if (!userInfo) {
          res.json({status:"error", message: "Invalid credentials!!!", data:null});
        } else {
          if(bcrypt.compareSync(req.body.password, userInfo.password)) {
            const token = jwt.sign({id: userInfo._id}, config.secret, { expiresIn: '1h' });
            res.json({status:"Authentication Done!", token});
          } else {
            res.json({status:"error", message: "Invalid credentials!!!", data:null});
          }
        }        
      }
    });
  },
  privateTest: (req, res) => {
    res.status(200).send({ message: 'Tienes acceso' });
  },

  getUser: (req, res) => {
    let userId = req.params.userId
    userModel.findById(userId, (err, user) => {
      if (err) return res.status(500).send({message: `Error making the request: ${err}`})
      if (!user) return res.status(404).send({message: `The user does not exist!`})
      res.status(200).send({ user })
    })
  },

  getUsers: (req, res) => {
    userModel.find({}, (err, users) => {
      if (err) return res.status(500).send({message: `Error making the request: ${err}`})
      if (!users) return res.status(404).send({message: 'There are no users'})
      res.status(200).send(users)
    })
  },

  updateUser: (req, res) => {
    let userId = req.params.userId
    userModel.findById(userId, (err, user) => {
      if (err) return res.status(500).send({message: `Error making the request: ${err}`})
      if (!user) return res.status(404).send({message: `The user does not exist!`})
      user.name = req.body.name
      user.email = req.body.email
      user.save((err, userStored) => {
      if (err) return res.status(500).send({message: `Error updating the user: ${err}`})
        res.status(200).send({ user: userStored })
      })
    })
  },

  deleteUser: (req, res) => {
    let userId = req.params.userId

    userModel.findById(userId, (err, user) => {
      if (err) return res.status(500).send({message: `Error deleting the user: ${err}`})
      if (!user) return res.status(404).send({message: `The user does not exist!`})
      user.remove(err => {
        if (err) return res.status(500).send({message: `Error deleting the user: ${err}`})
        res.status(200).send({message: 'User successfully deleted!'})
      })
    })
  }


}
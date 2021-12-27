import express from "express";
import multer from 'multer'
import * as jwt from '../../auth/jwt.js'
import checkDuplicateUsernameOrEmail from '../../middlewares/validateRegister.js'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  userProfile, emailVerify
} 
  from "./userController.js"
import checkUserStatus from "../../middlewares/userStatus.js";

const route = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix + '-' + file.originalname) 
    }
  })

var upload = multer({
    storage:storage,
    limits:{ fileSize:1024*1204*5}
})

route.get('/allUsers', getAllUsers);
route.get('/profile', jwt.verifyToken, userProfile)
route.post('/register',upload.single('image'), checkDuplicateUsernameOrEmail,createUser);
route.get('/:id', getUserById);
route.put('/edit/:id',upload.single('image'), updateUser);
route.delete('/delete/:id', deleteUser)
route.post('/login', checkUserStatus, login);
route.patch('/verify-email', emailVerify);


export default route
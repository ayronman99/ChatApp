const express = require('express');
const router = express.Router();
const passport = require('passport');
import { fetchChat } from "../controllers/getChat";
import { userReg, userLogin } from "../controllers/userReg";


router.route("/register").post(userReg)
router.route("/login").post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userLogin)
router.route("/chat").get(fetchChat)
export default router;
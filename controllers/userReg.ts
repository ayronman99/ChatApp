const User = require("../models/userModel");
import { Request, Response, NextFunction } from 'express';

export const userReg = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;
    try {
        console.log(email, username, password)

        if (!username || !password || !email) return res.status(400).json({ message: 'Username, password,  and email are required.' });

        const user = new User({ email, password, username });
        console.log('Not yet registered successfully!');

        const registeredUser = await User.register(user, password);
        console.log('Not yet registered successfully!2');

        req.login(registeredUser, err => {
            console.log(err)
            if (err) return next(err);
            // res.redirect('/');

            return res.send('Registered successfully!');
        })

    } catch (e: any) {
        // res.redirect('register');
        if (e?.code === 11000) {
            return res.json({
                message: 'Oops, the email is already registered!'
            })
        } else {
            return res.json({
                message: e.message
            })
        }
    }

}

export const userLogin = async (req: Request, res: Response) => {
    res.redirect("/");
}
// //jshint esversion:6

//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
// ********* must install body parser to use req.body **********
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//removed when hashing
// const encrypt = require('mongoose-encryption');
//removed when adding bcrypt
// const md5 = require('md5');
//removed with passport
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(
    session({
        secret: 'I love carne asada tacos',
        resave: false,
        saveUninitialized: false,
    })
);
 
app.use(passport.initialize());
app.use(passport.session());
 
mongoose.connect('mongodb://127.0.0.1:27017/userDB');
 
//schema
const { Schema } = mongoose;
const userSchema = new Schema({
    email: String,
    password: String,
});
 
userSchema.plugin(passportLocalMongoose);
 
//encryption plugin- must be before model
// moved const to .env file so it is hidden
//removed when hashing
// console.log(process.env.SECRET);
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET,
//     encryptedFields: ['password'],
// });
 
//model
const User = mongoose.model('User', userSchema);
 
// use static authenticate method of model in LocalStrategy
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(User.authenticate()));
 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.get('/', function (req, res) {
    res.render('home');
});
 
app.get('/login', function (req, res) {
    res.render('login');
});
 
app.get('/register', function (req, res) {
    res.render('register');
});
 
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
        console.log('USER NOW LOGGED OUT');
    });
});
 
app.get('/secrets', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        console.log('user does not exist');
        res.redirect('/login');
    }
});
 
app.post('/register', function (req, res) {
    //passport version
    console.log('[ ' + req.body.username + ' ]' + ' is now registered')
    User.register(
        { username: req.body.username },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/secrets');
                });
            }
        }
    );
});
 
//*************removed with passport
// //hash with salt
// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//     //document
//     const newUser = new User({
//         email: req.body.username,
//         password: hash,
//     });
//     newUser.save(function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render('secrets');
//         }
//     });
// });
 
app.post('/login', function (req, res) {
    //passport version
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    console.log('[ ' + req.body.username + ' ]' + ' is currently logged in');
    req.login(user, function (err) {
        if (err) {
            return next(err);
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect('/secrets');
            });
        }
    });
 
    //*************removed with passport
    // const username = req.body.username;
    // const password = req.body.password;
    // User.findOne({ email: username }, function (err, foundUser) {
    //     if (err) {
    //         console.log(err);
    //     } else if (foundUser) {
    //         bcrypt.compare(
    //             password,
    //             foundUser.password,
    //             function (err, result) {
    //                 if (result == true) {
    //                     res.render('secrets');
    //                 }
    //             }
    //         );
    //     }
    // });
});
 
app.listen(3000, function () {
    console.log('Server is running on port 3000.');
});
 











// //jshint esversion:6
// require('dotenv').config();
// // const md5 = require('md5');
// const express = require('express');
// const ejs = require('ejs');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// // const bcrypt = require('bcrypt');
// // const saltRounds = 10;


 
// const app = express();
 
// app.use(express.static('public'));
// app.set('view engine','ejs');
// app.use(express.urlencoded({extended:true}));

// app.use(session({
//   secret: 'I am new to web Development.',
//   resave: false,
//   saveUninitialized: false,
// }));

// app.use(passport.initialize());
// app.use(passport.session());


 
 
// main().catch(err => console.log(err));
 
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
//     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
//     const userSchema = new mongoose.Schema({
//         email:String,
//         password:String
//     });

//     User.plugin(passportLocalMongoose);
 
//     const User = mongoose.model('User',userSchema);

//     // use static authenticate method of model in LocalStrategy
//     const LocalStrategy = require('passport-local');

//     passport.use(new LocalStrategy(User.authenticate()));
//     // use static serialize and deserialize of model for passport session support

//     passport.serializeUser(User.serializeUser());
//     passport.deserializeUser(User.deserializeUser());
 
//     app.get("/",(req,res)=>{
//         res.render('home');
//     });
    
//     app.get("/register",(req,res)=>{
//         res.render('register');
//     });
 
//     app.post("/register",async(req,res)=>{

//         // const hash = bcrypt.hashSync(req.body.password, saltRounds);
//         // try {
//         //     const newUser = new User({
//         //         email:req.body.username,
//         //         password: hash
//         //     });
//         //     const result = await newUser.save();
//         //     if(result){
//         //         res.render('secrets');
//         //     }else{
//         //         console.log("Login Failed");
//         //     }
//         // } catch (err) {
//         //     console.log(err);
//         // }
//     });
 
 
//     app.get("/login",(req,res)=>{
//         res.render('login');
//     });
    
//     app.post("/login",async(req,res)=>{
//         // const username = req.body.username;
//         // const password = req.body.password;
 
//         // try {
//         //     const foundName = await User.findOne({email:username})
//         //     if(foundName){
//         //         if(bcrypt.compareSync(req.body.password, foundName.password)){
//         //             res.render('secrets');
//         //         }else{
//         //             res.send('Password Does not Match...Try Again !')
//         //         }
//         //     }else{
//         //         res.send("User Not found...")
//         //     }
//         // } catch (err) {
//         //     res.send(err);
//         // }
//     });
    
//     app.listen(3000,()=>{
//         console.log("Server is runing on port 3000...   ");
//     });
 
 
// }
 
 
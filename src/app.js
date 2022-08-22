const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcrypt");
require("./db/connection");
// const Register = require("./models/registers");
const Register = require('./models/registers');
const { json } = require("express");
const { default: mongoose } = require("mongoose");
const { resolveObjectURL } = require("buffer");
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
// const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(static_path));
app.set('view engine', "hbs");
app.set("views", template_path);
// hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/home", (req, res) => {
    res.render("home");
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerData = new Register({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            });
            const salt = await bcrypt.genSalt(10);
            registerData.password = await bcrypt.hash(registerData.password, salt);
            registerData.confirmpassword = await bcrypt.hash(registerData.confirmpassword, salt)
            const registersData = await registerData.save();
            res.status(201).render("home",{username:req.body.username});
        } else {
            res.status(201).render("register")
        }
    } catch (error) {
        res.status(400).send(error);
    }
})
app.get("/survey",async (req,res)=>{
    res.render("survey");
})
app.post("/survey",(req,res)=>{
    try{
        const username = req.body.username;
        res.status(201).render("solution",{[username]:req.body.username});
    }catch(err){
        console.log(err)
    }
})
app.get("/solution",async (req,res)=>{
    res.render("solution");
})
app.post("/", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const loginEmail = await Register.findOne({ email: email });
        bcrypt.compare(password, loginEmail.password, (err, data) => {
            //if error than throw error
            if (err) throw err

            //if both match than you can do anything
            if (data) {
                res.status(201).render("home", { username: loginEmail.username });
            } else {
                return res.status(201).render("index");
            }

        })

    } catch (err) {
        res.status(400).send(err)
    }


})

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});


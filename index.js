const express = require('express')
const bodyParser = require("body-parser");
const jwt = require('jwt-simple')
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require("passport");

//-----------------bcrypt-------------------
const bcrypt = require('bcrypt')
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


const app = express()
const port = 5000;
const SECRET = "USER_SECRET_KEY_888"

const requireJWTAuth = passport.authenticate("jwt", {session: false});
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: SECRET,
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done)=> {
    if (payload.sub === "admin") done(null, true);
    else done(null, false);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
passport.use(jwtAuth);

let products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 1000, stock: 5 },
    { id: 2, name: "Phone", category: "Electronics", price: 500, stock: 10 },];


const loginUsername = (req, res, next) => {
    if(req.body.username === "admin" && req.body.password === "12345"){
        next();
    }else{
        res.send("Error: username or password is incorrent");
    }
};

app.get("/products", requireJWTAuth, (req, res) => {
    res.status(200).json(products);
});

app.post("/login", loginUsername, (req, res)=>{
    const payload = {
        sub: req.body.username,
        role: "shop",
        iat: new Date().getTime(),
    };
    res.send(jwt.encode(payload, SECRET));
    //res.send("User " + req.body.username + " login success");
});

//---------------------------bcrypt------------------------
app.get("/hash",(req,res)=>{
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
        res.send(hash)
    })
})

app.post("/checkhash",(req,res)=>{
    console.log(req.body.hashpass)
    bcrypt.compare(myPlaintextPassword, req.body.hashpass, function(err, result){
        console.log(result);
        res.send(result)
    
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


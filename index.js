
const { faker, tr } = require('@faker-js/faker');
const mysql = require('mysql2');
const express =require("express")
const app = express()
const path=require("path")

const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Shivam@572004'
  });
let createRandomUser=()=> {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
       
    ];
  }


app.get('/',(req,res)=>{
    let q=`SELECT count(*) FROM user`
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err
            const count=(result[0]["count(*)"])
            res.render("home",{count})
        })

    }catch(err){
        console.log(err)
        res.send("some error in db")
    }
    
})


app.get("/user",(req,res)=>{
    let q=`SELECT * FROM user`
    try{
        connection.query(q,(err,users)=>{
            if (err) throw err
            res.render("showuser.ejs",{users})
          
        })

    }catch(err){
        console.log(err)
        res.send("some error in db")
    }
})

app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params
    let q=`SELECT * FROM user WHERE id='${id}'`
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err
            detail=result[0]
            res.render("edit",{detail})
        })

    }catch(err){
        console.log(err)
        res.send("some error in db")
    }

})


app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let { enterd_username:username ,enterd_password:password} =req.body
    console.log(req.body)
    console.log(username,password)
    let q=`SELECT * FROM user WHERE id='${id}'`
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err
            data_base_pass=result[0]["password"]
            if (password!=data_base_pass){
                res.send("wrong password")
            }else{
                let q2=`UPDATE user SET username='${username}' WHERE id='${id}'`
                connection.query(q2,(err,result)=>{
                    if (err)throw err
                    res.redirect("/user")
                })

            }
            
        })

    }catch(err){
        console.log(err)
        res.send("some error in db")
    }
   
})


app.listen("8080",()=>{
    console.log("server is working to port 8080")
})
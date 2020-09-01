const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { static } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});
app.post("/",(req,res)=>{
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    const data = {
        members : [{
            email_address: email,
            status: "subscribed",
            merge_fields : {
                FNAME: firstName,
                LNAME: secondName
            }
        }]
    };
// converting data to string json object
    const jsonData = JSON.stringify(data);
    const url = "My URL";
    const option = {
        method: "POST",
        auth: "My Authentication"
    }

    const request = https.request(url,option,(response)=>{
        if(response.statusCode === 200){
            res.sendFile( __dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(JSON.stringify(data)));
        })
    })
    request.write(jsonData);
    request.end();
});
//redirecting user to home page upon fail
app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is now up, Continue working!!");
})


const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleWare = require('./middleware');

class HandlerGenerator {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        
        let mockedUserName = 'admin';
        let mockedPassword = 'password';
        if(username && password){
            if(username === mockedUserName && password === mockedPassword){
                let token = jwt.sign({username: username}, config.secret, {expiresIn: '24h'});
                res.json({
                    success: true, 
                    message: "Authentication successful",
                    token: token                                    
                });
            }
            else{
                res.send(403).json({
                    message: "Incorrect username or password",
                    success: false
                });
            }
        }
        else{
            res.send(400).json({
                success: false,
                message: "Authorization failed!! "
            });
        }  
    }

    index(req, res){
        res.json({
            message:'Index page',
            success: true
        });
    }
}

function main(){
    let app = express();
    let handler = new HandlerGenerator();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.json());

    app.post('/login', handler.login);
    app.get('/', middleWare.checkToken, handler.index);

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
}

main();
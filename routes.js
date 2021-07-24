const express = require('express')
const jwt = require('jsonwebtoken')
const routes = express.Router()

routes.get('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM users', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})

//forma de verificar los verbos con el jwt y hacerlos privados.
    // jwt.verify(req.token, 'secretkey', (error, users) => {
    //     if(error){
    //         res.json({
    //             users
    //         })
    //     }else {
    //         res.sendStatus(403);
    //     }
    // })    
    
 

routes.post('/login', (req, res)=>{
    const user = {
        correo: "santiago.aponte1012@gmail.com",
        password : "hola123"
    }
            jwt.sign({user}, 'secretkey', {expiresIn: '3600s'}, (err, token) => {
                res.json({
                    token
                })
            })
        })

routes.post("/posts", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) =>{
        if(error){
            res.sendStatus(403);
        }else {
            res.json ({
                mensaje: "token verificado con exito",
                authData
            })
        }
    })
})

        // autorización por Bearer token
    function verifyToken(req, res, next){
            const bearerHeader = req.header['authorization'];
            if(typeof bearerHeader !== 'undefined'){
                bearerToken = bearerHeader.split(" ")[1];
                req.token = bearerToken;
                next();
            } else {
                res.sendStatus(403);
            }
    }

routes.post('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO users set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)

            res.send('user added!')
        })
    })
})

routes.delete('/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows)=>{
            if(err) return res.send(err)

            res.send('user excluded!')
        })
    })
})

routes.put('/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('UPDATE users set ? WHERE id = ?', [req.body, req.params.id], (err, rows)=>{
            if(err) return res.send(err)

            res.send('user updated!')
        })
    })
})

module.exports = routes
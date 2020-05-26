const express = require('express');
const path = require('path');
var Request = require("request");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const porta = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.use('/', (req, res) => {
    res.render('index.html');
})

let users = []
let word;

io.on('connection', socket => {
    
    console.log(socket.id)

   
    socket.on('newLogin', data => {
        users.push(data);
        console.log(data.autor);
        socket.broadcast.emit('newLoginAll', { obj : socket.id});
    });

    socket.on('newText', data => {
        console.log(data);
        socket.broadcast.emit('newTextRes', data);
    }); 

    socket.on('getWord', data => {
        Request.get("https://random-word-api.herokuapp.com/word?number=3", (error, res, body) => {
            if(error) {
             return console.dir(error);
             }
             word = JSON.parse(body);
             console.log(word);
             socket.emit('returnWord', word);
             socket.broadcast.emit('returnWord', word);
        });
    });
    
    socket.emit('getData', word);
    
    socket.on('sendTry', data => {
       console.log(data);
       socket.broadcast.emit('returnTry', data);
    });
    
    socket.on('sendSong', data =>{
        socket.emit('returnSong', data);
        socket.broadcast.emit('returnSong', data);
    })
});

server.listen(porta);
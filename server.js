const express = require('express');
const path = require('path');

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
io.on('connection', socket => {
    console.log(socket.id)
    socket.on('newLogin', data => {
        console.log(data.autor);
        socket.broadcast.emit('newLoginAll', { obj : socket.id});
    });

    socket.on('newText', data => {
        console.log(data);
        socket.broadcast.emit('newTextRes', data);
    }); 
 
});

server.listen(porta, () => {
    //console.log(`Server running at http://${hostname}:${port}/`);
});
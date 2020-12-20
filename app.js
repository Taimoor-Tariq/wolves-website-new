require('dotenv-flow').config();
const express = require('express');
const subdomain = require('express-subdomain');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(require('express-session')({ secret: process.env.SESSION_KEY }));
app.use(express.urlencoded( {extended: true} ));
app.use(require('body-parser').json());
app.use(express.static("public"));

app.use(subdomain('api', require('./routes/api')));
app.use(subdomain('www', require('./routes/www')));

io.on('connection', function(socket) {
    console.log(`  -> ${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log(`  <- ${socket.id} disconnected`);
    });
});

http.listen(3000, () => {
    console.log("Server running on port 3000");
})
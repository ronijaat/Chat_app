const express = require("express");
const path = require("path");
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }});

const app = express();
app.use(express.static(path.join(__dirname,'..')));
// app.use('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,"..","index.html"));
// });

const users = {};

io.on('connection',socket =>{
    socket.on('new-user-joined',name=>{
        // console.log("new user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on("send",message=>{
        socket.broadcast.emit("receive",{message:message, user:users[socket.id]});
    });

    socket.on("disconnect",message=>{
        socket.broadcast.emit("left",users[socket.id]);
        delete users[socket.id];
    })

})

app.listen(7000, ()=>{
    console.log(`server is running`);
})
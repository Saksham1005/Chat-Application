module.exports.chatSockets=function(SocketServer){
    const io=require("socket.io")(SocketServer);

    io.sockets.on("connection",function(socket){
        // console.log("New connection received", socket.id);

        socket.on("disconnect", function(){
            // console.log("Socket disconnected- ",socket.id);
        })

        socket.on("join_room",function(data){
            // console.log("joining request rec.", data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        })

        socket.on("send_message",function(data){
            io.in(data.chatroom).emit("receive_message",data);
        })
    })
}
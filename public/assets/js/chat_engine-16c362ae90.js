class ChatEngine{constructor(e,s){this.chatBoxId=$(`#${e}`),this.user_email=s,this.socket=io.connect("https://social-media-web-application.onrender.com:5000"),this.user_email&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",function(){console.log("Connection established using sockets...."),e.socket.emit("join_room",{user_email:e.user_email,chatroom:"codeial"}),e.socket.on("user_joined",function(e){console.log("A user joined ",e.user_email)}),$("#send-message").click(function(s){s.preventDefault();let n=$("#chat-message-input").val();e.socket.emit("send_message",{input_message:n,user_email:e.user_email,chatroom:"codeial"})}),e.socket.on("receive_message",function(s){let n=$("<li>"),t=$("#chat-messages-list"),i="other-message";s.user_email==e.user_email&&(i="self-message"),n.addClass(i);let a=$(`<span>
                    <p>${s.input_message}</p>
                    <p>${s.user_email}</p>
                </span>`);n.append(a),t.append(n)})})}}
class ChatEngine {
  constructor(chatBoxId, user_email) {
    this.chatBoxId = $(`#${chatBoxId}`);
    this.user_email = user_email;

    this.socket = io.connect(
      "https://chat-application-production-488f.up.railway.app:5000"
    );
    // this.socket=io.connect("127.0.0.1:5000");

    if (this.user_email) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;
    this.socket.on("connect", function () {
      console.log("Connection established using sockets....");

      self.socket.emit("join_room", {
        user_email: self.user_email,
        chatroom: "codeial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("A user joined ", data.user_email);
      });

      $("#send-message").click(function (event) {
        event.preventDefault();
        let input_message = $("#chat-message-input").val();

        self.socket.emit("send_message", {
          input_message,
          user_email: self.user_email,
          chatroom: "codeial",
        });
      });

      self.socket.on("receive_message", function (data) {
        let newMessage = $("<li>");
        let chat_list = $("#chat-messages-list");

        let assignedClass = "other-message";

        if (data.user_email == self.user_email) {
          assignedClass = "self-message";
        }

        newMessage.addClass(assignedClass);

        let message = $(`<span>
                    <p>${data.input_message}</p>
                    <p>${data.user_email}</p>
                </span>`);

        newMessage.append(message);
        chat_list.append(newMessage);
      });
    });
  }
}

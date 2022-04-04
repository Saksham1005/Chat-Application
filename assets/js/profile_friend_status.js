{
    $(document).ready(function(){
        // console.log("hello profile");
        let friend=$("#friend")
        friend.click(function(event){
            event.preventDefault();

            $.ajax({
                url:friend.prop("href"),
                type:"POST",
                success:function(data){
                    console.log(data);
                    if(data.message=="Friend added"){
                        friend.text("Remove Friend");
                    }
                    else{
                        friend.text("Add Friend")
                    }
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
        // check friend
        let check_friend=function(){
            let check=$("a#check-friend")
            $.ajax({
                url:check.prop("href"),
                type:"POST",
                success:function(data){
                    let friend=$("#friend")
                    if(data.message=="Friend found"){
                        friend.text("Remove Friend")
                    }
                    else{
                        friend.text("Add Friend")
                    }
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })

        }

        check_friend();
    })


}
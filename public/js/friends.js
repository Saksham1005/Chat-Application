{
    $(document).ready(function(){
        const div=$("div.users div");
        for(let i=0;i<div.length;i++){
            const button=$("button",div[i]);
            add_delete_friend(button,div[i]);
        }
    })


    // Adding/deleting user to friend list
    function add_delete_friend(button){
        button.click(function(event){
            event.preventDefault();

            let user_id=button.attr("id");
            $.ajax({
                url:`/friend?id=${user_id}`,
                type:"POST",
                success:function(data){
                    console.log(data);

                    if(data.data.message=="Friend added")
                    button.prop("value","Friend");

                    else
                    button.prop("value","Add Friend");
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })

        })
    }
}
// const Post=require("../../model/posts")
// Don't forget the selector in jquery;
{
    $(document).ready(function(){
        let arr=$("li a#delete-post-button")
        for(let i=0;i<arr.length;i++){
            delete_post(arr[i]);
        }
        // delete-comment-button
        let com=$("li a#delete-comment-button")
        for(let i=0;i<com.length;i++){
            delete_comment(com[i]);
        }
        let form=$("li form#comment-form")
        for(let i=0;i<form.length;i++){
            create_comment(form[i]);
        }

        //Add like functionality to preloaded comments 
        let comment_like=$(".comment_like");
        for(let i=0;i<comment_like.length;i++){
            // console.log( $($(comment_like[i]).parent())[0] );
            comment_like_button( $($(comment_like[i]).parent())[0] );
        }

        //Add like functionality to preloaded posts 
        let post_like=$(".post_like");
        for(let i=0;i<post_like.length;i++){
            // console.log( $($(comment_like[i]).parent())[0] );
            post_like_button( $($(post_like[i]).parent())[0] );
        }

        let friend=$("a#friend")
        for(let i=0;i<friend.length;i++){
            
            $(friend[i]).click(function(event){
                event.preventDefault();
                // let id=$(friend[i]).prop("id")

            $.ajax({
                url:$(friend[i]).prop("href"),
                type:"POST",
                success:function(data){
                    // console.log(data);
                    if(data.message=="Friend added"){
                        // friend.text("Remove Friend");
                    }
                    else{
                        $(`p#${data.id}`).remove();
                        // console.log($(friend[i]).parent())
                        // $(`#${id}${ $($(friend[i]).parent()) }`).remove();
                        // friend.text("Add Friend")
                    }
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }
        
    })
    
    


    let noty_post=function(message){
        new Noty({
            type:'success',
            text: message,
            layout:'topRight',
            theme: 'relax',
            timeout: 1500,
            progressBar:true
        }).show();
    }

    // method to delete a post
let delete_post=function(delete_post_button){
        
        $(delete_post_button).click((e)=>{
            e.preventDefault();
            $.ajax({
                type:"GET",
                url:$(delete_post_button).prop('href'),
                success:function(data){
                    // console.log(data.data.post._id)
                    $(`.post-${data.data.post._id}`).remove();
                    noty_post(data.message);
                },
                error:function(error){
                    console.log(error);
                }
            })
        })
    }

    // creating the post
    let posts_form=$('#new-post-form')

        posts_form.submit((e)=>{
            e.preventDefault();
            
            $.ajax({
                type:"Post",
                url:posts_form.attr('action'),
                data:posts_form.serialize(),
                success:async function(data){
                    // console.log(data);
                        let created_post=newPostDOM(data.data.post,data.name);
                        $('.posts>ul').prepend(created_post);
                        noty_post(data.message);

                        delete_post($('a#delete-post-button', created_post));
                        post_like_button(created_post);
                        create_comment($('form#comment-form', created_post));
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })

        })



// Comment creation
let create_comment=function(comment_form){

$(comment_form).submit(function(e){

    // console.log(data_comment);
    e.preventDefault();

    $.ajax({
        type:"POST",
        url:$(comment_form).attr('action'),
        data:$(comment_form).serialize(),
        success:function(data){
            // console.log("comment created");
            let comment=new_comment(data.data.comment);
            // console.log(comment+"\n");
            $(`#post-comments-${data.data.comment.post}`).append(comment);
            delete_comment($("a#delete-comment-button", comment));
            comment_like_button(comment);
            noty_post(data.message);
        },
        error:function(error){
            console.log(error.responseText);
        }
    })

    })
}

let delete_comment=function(delete_comment_button){
    $(delete_comment_button).click(function(e){
        // console.log("event activated"+delete_comment_button);
        e.preventDefault();
        $.ajax({
            type:"GET",
            url:$(delete_comment_button).prop('href'),
            success:function(data){
                // console.log($("div#comment-id-"+data.data.comment._id));
                $("div#comment-id-"+data.data.comment._id).remove();
                noty_post(data.message);
            },
            error:function(error){
                console.log(error.responseText);
            }
        })
    })
}

// Comment Like button 
    let comment_like_button=function(comment_div){
        $(".comment_like",comment_div).click((event)=>{
            event.preventDefault();
            
            $.ajax({
                type:"Post",
                url:$(".comment_like",comment_div).prop("href"),
                success:function(data){
                    console.log(data)
                    if(data.message!="Invalid user"){
                        if(data.data.deleted==true){
                            let value=$(".comment_like_value",comment_div)
                            let num=Number(value.val())-1;
                            value.val(num);
                        }
                        else{
                            let value=$(".comment_like_value",comment_div)
                            let num=Number(value.val())+1;
                            value.val(num);
                        }
                    }
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

// Post Like button 
    let post_like_button=function(comment_div){
        $(".post_like",comment_div).click((event)=>{
            event.preventDefault();
            
            $.ajax({
                type:"Post",
                url:$(".post_like",comment_div).prop("href"),
                success:function(data){
                    console.log(data)
                    if(data.message!="Invalid user"){
                        if(data.data.deleted==true){
                            let value=$(".post_like_value",comment_div)
                            let num=Number(value.val())-1;
                            value.val(num);
                        }
                        else{
                            let value=$(".post_like_value",comment_div)
                            let num=Number(value.val())+1;
                            value.val(num);
                        }
                    }
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

let new_comment=function(comment){
    return $(`
    <div id="comment-id-${comment._id}" style="border: 1px rgb(0, 238, 255) solid; border-radius: 20px; box-sizing: border-box; padding: 7.5px; margin-bottom: 0.8em;">
        <small><a id="delete-comment-button" href="/comment/destroy/${comment._id}"> X </a></small>
        ${comment.content}
        <br>
        ${comment.user.name}
        <br>
        <!-- comment like functionality for ajax created comments -->
        <input type="text" class="comment_like_value" value="${comment.likes.length}" style="width: 1em;">
        <a href="/likes/toggle?id=${comment._id}&type=Comment" class="comment_like">Like</a>
        
        <br>
    </div>
    `);
}


// method to create a post in the DOM  
let newPostDOM=function(post,name){
    return $(`
                <li class="post-${post._id}" >
                    <div class="post">
                    <p style="border: 1px black solid; border-radius: 20px; box-sizing: border-box; padding: 10px; margin-bottom: 0.8em;">
                        <small><a id="delete-post-button" href="/post/destroy/${post._id}"> X </a></small>
                    
                        ${post.content}
                        <br>
                        ${name} creted the post! 
                    <br>
                    <!-- comment like functionality for ajax created comments -->
                    <input type="text" class="post_like_value" value="${post.likes.length}" style="width: 1em;">
                    <a href="/likes/toggle?id=${post._id}&type=Post" class="post_like">Like</a>
                    <br>            

                    </p>
                <p>Comments</p>
                    
                    <div id="post-comments-${post._id}">
                    
                    </div>

                    
                    
                    <section>
                        <form id="comment-form" action="/comment/create" method="post">
                            <input type="hidden" name="post_id" value=${post._id} >
                            <textarea name="comment" cols="30" rows="3" placeholder="Write Comment...." required></textarea>
                            <input type="submit" value="Submit Comment!!">
                        </form>
                    </section>
                    
                    </div>
                </li>`)
}

}

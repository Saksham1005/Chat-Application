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
            // console.log(data);
            let comment=new_comment(data.data.comment,data.name);
            $(`#post-comments-${data.data.comment.post}`).append(comment);
            noty_post(data.message);
            delete_comment($(`a#delete-comment-button`), comment);
        },
        error:function(error){
            console.log(error.responseText);
        }
    })

    })
}

let delete_comment=function(delete_comment_button){
    $(delete_comment_button).click(function(e){
        e.preventDefault();
        // console.log($(delete_comment_button))
        $.ajax({
            type:"GET",
            url:$(delete_comment_button).prop('href'),
            success:function(data){
                // console.log(data);
                // console.log($(`div#comment-id-${data.data.comment._id}`))
                $("div#comment-id-"+data.data.comment._id).remove();


                // $(`div#comment-id-${data.data.comment._id}`).remove();
            noty_post(data.message);

            },
            error:function(error){
                console.log(error.responseText);
            }
        })
    })
}

let new_comment=function(comment,name){
    return $(`
    <div id="comment-id-${comment._id}">
        <small><a id="delete-comment-button" href="/comment/destroy/${comment._id}"> X </a></small>
        ${comment.content}
        <br>
        ${name}
        <br><br>
    </div>
    `);
}


// method to create a post in the DOM  
let newPostDOM=function(post,name){
    return $(`
                <li class="post-${post._id}" >
                    <div class="post">
                    <p>
                        <small><a id="delete-post-button" href="/post/destroy/${post._id}"> X </a></small>
                    
                        ${post.content}
                        <br>
                        ${name} creted the post! 
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

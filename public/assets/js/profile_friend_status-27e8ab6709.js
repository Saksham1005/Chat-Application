$(document).ready((function(){let e=$("#friend");e.click((function(n){n.preventDefault(),$.ajax({url:e.prop("href"),type:"POST",success:function(n){console.log(n),"Friend added"==n.message?e.text("Remove Friend"):e.text("Add Friend")},error:function(e){console.log(e.responseText)}})}));!function(){let e=$("a#check-friend");$.ajax({url:e.prop("href"),type:"POST",success:function(e){let n=$("#friend");"Friend found"==e.message?n.text("Remove Friend"):n.text("Add Friend")},error:function(e){console.log(e.responseText)}})}()}));
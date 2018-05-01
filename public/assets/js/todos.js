//Check Off Specific Todos by Clicking
$("ul").on("click", "#act", function(){
  $(this).toggleClass("completed");
});

//click on X to delete To-Do
$("ul").on("click", "#hapus", function(event){
  $(this).parent().fadeOut(500,function(){
  });
  event.stopPropagation();
});

$(".fa-plus").click(function(){
  $("input[type='text']").fadeToggle();
});

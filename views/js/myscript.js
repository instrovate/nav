
jQuery(document).ready(function($){
  $('.expand').click(function(){
    $('.section_right').css({'margin-left':'0'});
    $('.section_right').toggleClass('fullscreen'); 
    $(this).hide();
    $('.contract').show();
    });
    $('.contract').click(function(){
      $('.section_right').css({'margin-left':'20px'});
      $('.section_right').toggleClass('fullscreen'); 
      
      $(this).hide();
      $('.expand').show();
      });
$('.hint').click(function(){
$(this).children('.hint_span').toggle();
$(this).children('p').toggle();
});
var quill = new Quill('#editor', {
    theme: 'snow'
  });


  

});

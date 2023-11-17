$(document).ready(function(){
  $( "#menu-short" ).mouseover(function() {
    $('#menu-short').collapse('hide');
    $('#menu-long').collapse('show');
  });

  $( "#menu-long" ).mouseleave(function() {
    $('#menu-long').collapse('hide');
    $('#menu-short').collapse('show');
  });
});

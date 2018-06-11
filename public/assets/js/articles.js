// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(document).ready(function () {

  $(".save-article").click(function (event) {
      
      
      var id = $(this).data("id");
      console.log("got here id:",id)
      var saved = {
          saved: true
              };

      $.ajax('/articles/save/' + id, {
          type: "POST",
        
      }).then(function () {
        console.log("saved ID# " + id );
          location.reload();
      }).then(function(){
            $('#'+ id).html("<h4>Article Has Been Saved.</h4>");
        setTimeout(function(){
          removeElement(id);
        },5000)
      });
    


  });

  $(".delete-article").click(function (event) {
      
      
    var id = $(this).data("id");
    console.log("got here id:",id)
    var saved = {
        saved: false
            };

    $.ajax('/articles/delete/' + id, {
        type: "POST",
      
    }).then(function () {
      console.log("unsaved ID# " + id );
        location.reload();
    }).then(function(){
          $('#'+ id).html("<h4>Article Has Been Removed.</h4>");
      setTimeout(function(){
        removeElement(id);
      },5000)
    });
  


});

  $(".add-note").click(function (event){
   
    var articleId = $(this).data("id");
    var formName = "form-" + articleId;
    var form = $('#' + formName); 
    console.log('formname',formName);
    var dataString=form.serialize();
    console.log(dataString);
    var baseURL = window.location.origin;
    console.log(baseURL);
    $.ajax({
        url: baseURL + '/add-note/' + articleId,
        type: 'POST',
        data: dataString,
        dataType: "json"
      })
      .done(function() {
        location.reload();
      });
      
      // Prevent Default
      return false;
  
  });
 
  $(".scrape").click(function (event){
    this.attr('value','Scraping...Please Wait');
    var baseURL = window.location.origin;
    console.log(baseURL);
    $.ajax('/scrape')
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });
      
      // Prevent Default
      return false;
  
  });

});
  
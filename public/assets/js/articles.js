// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(document).ready(function () {

  $(".save-article").click(function (event) {
      event.preventDefault();
      
      var id = $(this).data("id");
      console.log("got here id:",id)
      var saved = {
          saved: true
              };

      $.ajax("/articles/save/" + id, {
          type: "PUT",
          data: saved
      }).then(function () {
        console.log("saved ID# " + id );
          location.reload();
      }).then(function(){
            $('#'+ id).innerHTML="<h3>Article Has Been Saved.</h3>";
        setTimeout(function(){
          removeElement(id);
        },1000)
      });
    


  });


  $(".add-note").click(function (event){
    event.preventDefault();
    var articleId = $(this).data("id");
    var formName = "form-" + articleId;
    var form = $('#' + formName); 
    console.log(form.serialize());
    var baseURL = window.location.origin;
    $.ajax({
        url: baseURL + '/add-note/' + articleId,
        type: 'POST',
        data: form.serialize()
      })
      .done(function() {
        // Refresh the Window after the call is done
        location.reload();
      });
      
      // Prevent Default
      return false;
  
  });
 


});
  
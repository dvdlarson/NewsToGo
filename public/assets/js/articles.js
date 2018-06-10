// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(function () {


//   $(".save-article").on("submit", function (event) {
//       event.preventDefault();
//       var newBurger = {
//       name: $("#newBurger").val().trim()
//       };
//       $("#newBurger").empty();
//       $("#burgerform")[0].reset();
//       console.log("attempting to add: "+newBurger.name);
//       $.ajax("/api/burgers", {
//           type: "POST",
//           data: newBurger
//       }).then(function () {
//           console.log("Added new burger: " + newBurger.name);
//           location.reload();
          
//       });
//   });



  $(".save-article").click(function (event) {
      event.preventDefault();
      //i tried.
      // var audio = new Audio('../assets/img/burger.mp3');
      // audio.play();
      // audio.onended = function(){
      var id = $(this).data("id");
      
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
  //  }

  });



});
  
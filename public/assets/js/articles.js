// Make sure we wait to attach our handlers until the DOM is fully loaded.

$(function () {


  $(".add-burger").on("submit", function (event) {
      event.preventDefault();
      var newBurger = {
      name: $("#newBurger").val().trim()
      };
      $("#newBurger").empty();
      $("#burgerform")[0].reset();
      console.log("attempting to add: "+newBurger.name);
      $.ajax("/api/burgers", {
          type: "POST",
          data: newBurger
      }).then(function () {
          console.log("Added new burger: " + newBurger.name);
          location.reload();
          
      });
  });



  $(".eat-burger").click(function (event) {
      event.preventDefault();
      //i tried.
      // var audio = new Audio('../assets/img/burger.mp3');
      // audio.play();
      // audio.onended = function(){
      var id = $(this).data("id");
      
      var eaten = {
          devoured: true
              };

      $.ajax("/api/burgers/" + id, {
          type: "PUT",
          data: eaten
      }).then(function () {
        console.log("munched ID# " + id );
          location.reload();
      });
  //  }

  });



});
  
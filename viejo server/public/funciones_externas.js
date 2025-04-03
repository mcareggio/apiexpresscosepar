function cambiar_enlaces(){
    var periodo=document.getElementById("select_periodos").value
    var inputs = document.getElementsByTagName("a");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].href=inputs[i].id+"&&periodo="+periodo;
    }
}
window.onload = function() {
    cambiar_enlaces();
  };
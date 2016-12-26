$( document ).ready(function() {
    var borrar = document.getElementById("borraruser")
    var adduser = document.getElementById("adduser") 
   
    
    
    borrar.style.display = 'none';
    adduser.style.display = 'none';
     $("#test1").click(function(){
        $("#test2").attr("disabled", "true");
        borrar.style.display = 'block';
        adduser.style.display = 'none';
    }); 
    
    $("#test2").click(function(){
        $("#test1").attr("disabled", "true");
        borrar.style.display = 'none';
        adduser.style.display = 'block';
        $(".contenedor4").css("height", "650px");
        $(".contenedor4").css("width", "700px");
        
    }); 
    
    
    
});
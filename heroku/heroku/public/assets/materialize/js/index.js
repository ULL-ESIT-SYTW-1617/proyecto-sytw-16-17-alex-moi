$( document ).ready(function() {
    var visible     = document.getElementById("vis");
    var contenedor2 = document.getElementById("idcontenedor2");

    
    visible.style.display = 'none';
    
    $("#test1").click(function(){
        $("#test3").attr("disabled", "true");
        $("#test2").attr("disabled", "true");
        $("#test4").attr("disabled", "true");
    }); 
    
    $("#test2").click(function(){
        $("#test1").attr("disabled", "true");
        $("#test3").attr("disabled", "true");
        $("#test4").attr("disabled", "true");
    });  
    
    
    //Si se selecciona la opcion añadir usuario se añaden nuevos campos para rellenar sobre ese usuario
    $("#test3").click(function(){
        $("#test1").attr("disabled", "true");
        $("#test2").attr("disabled", "true");
        $("#test4").attr("disabled", "true");

        
        visible.style.display = 'block';
        
        $("#idcontenedor2").css("height", "auto");
        $("#idcontenedor2").css("margin-bottom", "150px");
        //contenedor2.style.height = '550 px';
    });
    
    $("#test4").click(function(){
        $("#test1").attr("disabled", "true");
        $("#test2").attr("disabled", "true");
        $("#test3").attr("disabled", "true");
    }); 
    
    
    $("#test5").click(function(){
            $("#test6").attr("disabled", "true");
    }); 
    
    $("#test6").click(function(){
        $("#test5").attr("disabled", "true");
    }); 
});



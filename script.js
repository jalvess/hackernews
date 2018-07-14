$(document).ready(function(){
    jQuery.expr[":"].contains = jQuery.expr.createPseudo(function(arg) {
        return function( elem ) {
            return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });
    disableSearch(true);
    carregarPosts();
    $("#update").click(function(e){
        e.preventDefault();
        $(this).addClass("not-visible");
        disableSearch(true);
        $("#posts").children().remove();
        carregarPosts();
    });

    $("#search").on("keyup",function(){
        setTimeout(function(){
        $('#posts .post h3:not(:contains('+ this.value + ')),a[rel=author]:not(:contains(' + this.value + "))").parent().hide();
        $('#posts .post h3:contains('+ this.value + '),a[rel=author]:contains('+ this.value + ')').parent().show();
        if(!this.value)
        $('#posts .post').fadeIn(500);
        },2000);
    });
});

function carregarPosts(){
    $.getJSON('https://hacker-news.firebaseio.com/v0/topstories.json', function(d){
        var qtdPosts = d.length;
        $.each(d,function(key,val){
            var uri = "https://hacker-news.firebaseio.com/v0/item/"+ val + ".json";
            $.getJSON(uri,function(k,v){
                
    $('#posts').append($("<article />").addClass("post").attr("id",k["id"]).append($("<i />").text(key + 1).addClass("index"))
               .append($("<h3 />").text(k["title"]))
               .append($("<span />").addClass("time").text(new Date(1000 * (k["time"]))))
               .append($("<a href='#' rel='author' />").before(document.createTextNode("by: ")).text(k["by"]))
            //    .append($("<a href='#' />").addClass("tag").attr("data-type",k["type"]).text(k["type"]))
               .append($("<p />").addClass("text").html(k["text"]))                   
               .append($("<a href='#' />").addClass("score").attr("title",k["score"] + " points"). html("&#5839; " +  k["score"]))
               .append($("<a target=_blank />").attr("href",k["url"]).addClass("url").text(k["url"]))
               .append($("<a/>").attr("href","#").attr({"data-comentarios": k["kids"],"data-show" : false}).addClass("btn-comentario").click(mostrarComentarios).text("Show comments (" + (k["kids"] ? k["kids"].length : 0) + ")"))
                );

            if(key + 1 == qtdPosts){
                $("#update").removeClass("not-visible");
                // $("#search").attr({"disabled": false,"placeholder" : "title or author"}).removeClass("carregando");
                disableSearch(false);
            }
            });
            
        });
        $('#loading').remove();
    });
}

function mostrarComentarios(evt){
    evt.preventDefault();
    var secao = $(this).parent();
    var comentarios = $(this).attr("data-comentarios");
    if(!comentarios)return false;
    $(secao).children(".btn-comentario").off("click",mostrarComentarios);
    $(secao).children(".btn-comentario").on("click",esconderComentario).text("Hide comments");  
    if($(secao).children(".btn-comentario").attr("data-show") == "true"){
    $(secao).children(".comentario").fadeIn(200);
    return false;
    }      
    $(secao).children(".btn-comentario").attr("data-show",true);
    $(secao).append($("<div id=loading />"));
    $.each(comentarios.split(","), function(k,v){
        var uri = "https://hacker-news.firebaseio.com/v0/item/"+ v + ".json";         
        $.getJSON(uri, function(key,value){
            $(secao).append($("<div />").addClass("comentario")
                    .append($('<span />').addClass("author").text(key["by"]))
                    .append($('<span />').addClass("time").text(new Date(key["time"] * 1000)))
                    .append($('<p />').addClass("").html(key["text"]))
        );
        }).fail(function(){
            $("#loading").remove();                
        })
        .done(function(){
            $("#loading").remove();
        });

    });
}

function disableSearch(disable){
    if(disable)
        $("#search").attr({"disabled":true, "placeholder": "Searching posts..."}).addClass("carregando");
    else
        $("#search").attr({"disabled":false,"placeholder":"title or author"}).removeClass("carregando");
    
}

function esconderComentario(evt){
    evt.preventDefault();
    $(this).parent().children(".btn-comentario").off("click",esconderComentario);
    $(this).parent().children(".btn-comentario").on("click",mostrarComentarios).text("Show comments (" + $(this).parent().children(".comentario").length + ")");
    $(this).parent().children(".comentario").fadeOut(600);
}
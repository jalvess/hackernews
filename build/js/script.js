function carregarPosts(){$.getJSON("https://hacker-news.firebaseio.com/v0/topstories.json",function(e){var t=e.length;$.each(e,function(e,a){var n="https://hacker-news.firebaseio.com/v0/item/"+a+".json";$.getJSON(n,function(a,n){$("#posts").append($("<article />").addClass("post").attr("id",a.id).append($("<i />").text(e+1).addClass("index")).append($("<h3 />").text(a.title)).append($("<span />").addClass("time").text(new Date(1e3*a.time))).append($("<a href='#' rel='author' />").before(document.createTextNode("by: ")).text(a.by)).append($("<p />").addClass("text").html(a.text)).append($("<a href='#' />").addClass("score").attr("title",a.score+" points").html("&#5839; "+a.score)).append($("<a target=_blank />").attr("href",a.url).addClass("url").text(a.url)).append($("<a/>").attr("href","#").attr({"data-comentarios":a.kids,"data-show":!1}).addClass("btn-comentario").click(mostrarComentarios).text("Show comments ("+(a.kids?a.kids.length:0)+")"))),e+1==t&&($("#update").removeClass("not-visible"),disableSearch(!1))})}),$("#loading").remove()})}function mostrarComentarios(e){e.preventDefault();var t=$(this).parent(),a=$(this).attr("data-comentarios");return!!a&&($(t).children(".btn-comentario").off("click",mostrarComentarios),$(t).children(".btn-comentario").on("click",esconderComentario).text("Hide comments"),"true"==$(t).children(".btn-comentario").attr("data-show")?($(t).children(".comentario").fadeIn(200),!1):($(t).children(".btn-comentario").attr("data-show",!0),$(t).append($("<div id=loading />")),void $.each(a.split(","),function(e,a){var n="https://hacker-news.firebaseio.com/v0/item/"+a+".json";$.getJSON(n,function(e,a){$(t).append($("<div />").addClass("comentario").append($("<span />").addClass("author").text(e.by)).append($("<span />").addClass("time").text(new Date(1e3*e.time))).append($("<p />").addClass("").html(e.text)))}).fail(function(){$("#loading").remove()}).done(function(){$("#loading").remove()})})))}function disableSearch(e){e?$("#search").attr({disabled:!0,placeholder:"Searching posts..."}).addClass("carregando"):$("#search").attr({disabled:!1,placeholder:"title or author"}).removeClass("carregando")}function esconderComentario(e){e.preventDefault(),$(this).parent().children(".btn-comentario").off("click",esconderComentario),$(this).parent().children(".btn-comentario").on("click",mostrarComentarios).text("Show comments ("+$(this).parent().children(".comentario").length+")"),$(this).parent().children(".comentario").fadeOut(600)}$(document).ready(function(){jQuery.expr[":"].contains=jQuery.expr.createPseudo(function(e){return function(t){return jQuery(t).text().toUpperCase().indexOf(e.toUpperCase())>=0}}),disableSearch(!0),carregarPosts(),$("#update").click(function(e){e.preventDefault(),$(this).addClass("not-visible"),disableSearch(!0),$("#posts").children().remove(),carregarPosts()}),$("#search").on("keyup",function(){setTimeout(function(){$("#posts .post h3:not(:contains("+this.value+")),a[rel=author]:not(:contains("+this.value+"))").parent().hide(),$("#posts .post h3:contains("+this.value+"),a[rel=author]:contains("+this.value+")").parent().show(),this.value||$("#posts .post").fadeIn(500)},2e3)})});
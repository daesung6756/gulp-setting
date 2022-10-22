"use strict";

const UI = {
    init : function() {
        if($("[data-popup]").length > 0) {this.popups();}
        if($("[data-select]").length > 0) {this.select();}
        if($("[data-toggle]").length > 0) {this.toggle();}
    },
    popups : () => {
        console.log("popups init")
        let popupGroup = [];
        let dimmed = '<div class="dimmed"></div>';

        $("[data-popup]").each(function() {
            if($.inArray($(this).data("popup") , popupGroup ) === -1){
                popupGroup.push($(this).data("popup"))
            }
        });

        console.log("popups Array check : ", popupGroup)
        $.each(popupGroup, (key, value) => {
            const popup = $("[data-popup='" + value + "']"),
                open = $("[data-popup-open='" + value + "']"),
                close = $("[data-popup-close='" + value + "']")

            open.on("click", () => {UI.popupsActivate(popup);console.log("popups open click")})
            close.on("click", () => {UI.popupsInActivate(popup);console.log("popups closa click")})
        })
    },
    popupsActivate : ( popup ) => {
        popup.addClass("is-show")
    },
    popupsInActivate : ( popup ) => {
        popup.removeClass("is-show")
    },
    select : () => {
        console.log("select init")
    },
    toggle : () => {
        console.log("toggle init")
    }
}

// scroll
$(window).on("scroll",() => {
    console.log("on scroll")
})
// resize
$(window).on("resize",() => {
    console.log("on resize")
})
// ready
$(function(){
    UI.init();
})
// load
$(window).on("load",() => {
    console.log("load done")
})
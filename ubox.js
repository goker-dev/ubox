(function( $ ){
    var objects;
    // Methods
    var m = {
        open: function(e,el,o){
            e.preventDefault();
            $('embed, object, select').css({
                'visibility' : 'hidden'
            });
            // GUI
            $('body').append('<div id="ubox-overlay"></div>'
                +'<div id="ubox"><div id="ubox-container"><div id="ubox-data">'
                +'<span id="ubox-caption"></span><span id="ubox-number"></span>'
                +'<a id="ubox-close"></a>'
                +'</div>'
                +'<div id="ubox-media">'
                +'<img id="ubox-image"/>'
                +'<div id="ubox-nav">'
                +'<a id="ubox-prev"></a><a id="ubox-next"></a>'
                +'</div></div></div></div>');
            // esc -> close
            $(document).keydown(function(e) { 
                if ( e.keyCode == 27 ) { 
                    m.close();
                    $(document).unbind();
                }
            });
            // page sizes
            $('#ubox-overlay').css({
                position    : 'absolute',
                top         : 0,
                opacity     : o.opacity,
                width       : $(document).width(),
                height      : $(document).height(),
                'z-index'   : 9000,
                background  : '#000'
            }).fadeIn();
            $('#ubox').css({
                position    : 'absolute',
                width       : '100%',
                'z-index'   : 10000,
                top         : $(window).scrollTop() + ($(window).height() - $('#ubox').outerHeight(true)) *.5,
                left        : $(window).scrollLeft(),
                'color'     : o.color,
                'text-align': 'center'
            }).show();
            $('#ubox-container').css({
                position    : 'relative',
                width       : 100,
                height      : 100,
                margin      : '0 auto',
                padding     : o.padding,
                'z-index'   : 9000,
                background  : o.background
            });
            $('#ubox-media').css({
                position    : 'relative',
                background  : 'url('+ o.loader +') center center no-repeat'
            }); 
            console.log($('#ubox-data').height());
            $('#ubox-nav').css({
                position    : 'absolute',
                top         : 0,
                left        : 0,
                width       : '100%',
                height      : '100%',
                'z-index'   : 1000
            });
            $('#ubox-prev, #ubox-next').css({
                display     : 'block',
                width       : '49%',
                height      : '100%'
            });
            $('#ubox-number, #ubox-prev').css({
                'float'     : 'left'
            });
            $('#ubox-close, #ubox-next').css({
                'float'     : 'right'
            });
            $('#ubox-close').css({
                width       : 20,
                height      : 20,
                background  : 'url('+ o.close +') center center no-repeat'
            }).click(function() {
                m.close();
                return false;
            });
            if(!o.outClick)
                $('#ubox, #ubox-overlay').click(function() {
                    m.close();
                    return false;
                });
            o.media.length = 0;
            o.active = 0;
            if ( objects.length == 1 ) {
                o.media.push(new Array(el.attr('href'),el.attr('title')));
            }else {
                for ( var i = 0; i < objects.length; i++ ) {
                    o.media.push(new Array($(objects[i]).attr('href'),$(objects[i]).attr('title')));
                }
            }
            while ( o.media[o.active][0] != el.attr('href') ) {
                o.active++;
            }
            m.get(o);
            return false;
        },
        get: function(o){
            $('#ubox-image,#ubox-data,#ubox-nav').hide();
            $('#ubox-image').load(function() {
                // width and height + padding
                var w = $(this).width();
                var h = $(this).height();
                if( $(window).width() < w){
                    w = $(window).width();
                    $('#ubox-image').width(w);
                    h = $('#ubox-image').height();
                }
                $('#ubox').css({
                    top:$(window).height() > h
                    ? ($(window).scrollTop() + ($(window).height() - h) *.5)
                    : $(window).scrollTop() + 0,
                    left:$(window).scrollLeft()
                });
                if($(document).height() < h)
                    $('#ubox-overlay').height(h);
                // effect
                $('#ubox-container').animate({
                    'width': w,
                    'height': h + $('#ubox-data').height()
                },o.speed,function() {
                    $('#ubox-data').slideDown('fast');
                    if ( o.media[o.active][1] )
                        $('#ubox-caption').html(o.media[o.active][1]).show();
                    if ( o.media.length > 1 )
                        $('#ubox-number').html(( o.active + 1 ) + ' / ' + o.media.length).show();
                    $('#ubox-image').fadeIn(function() {
                        m.nav(o);
                    });
                });
                
                $(this).unbind('load');
                // image loaded count
                if(pageTracker) pageTracker._trackEvent('ubox', 'loaded',
                    o.media[o.active][1],
                    o.media[o.active][0]);
            }).attr('src',o.media[o.active][0]);
        },
        nav: function(o){
            $('#ubox-nav').show();
            // next
            if ( o.active != 0 ) {
                $('#ubox-prev').unbind().hover(function() {
                    $(this).css({
                        'background' : 'url(' + o.previous + ') -150px 20% no-repeat'
                    });
                },function() {
                    $(this).css({
                        'background' : 'transparent'
                    });
                }).click(function() {
                    o.active = o.active - 1;
                    m.get(o)
                    return false;
                }).show();
            } else $('#ubox-prev').unbind().hide();
            // previous
            if ( o.active != ( o.media.length -1 ) ) {
                $('#ubox-next').unbind().hover(function() {
                    $(this).css({
                        'background' : 'url(' + o.next + ') '+($(this).width()-50)+'px 20% no-repeat'
                    });
                },function() {
                    $(this).css({
                        'background' : 'transparent'
                    });
                }).click(function() {
                    o.active = o.active + 1;
                    m.get(o)
                    return false;
                }).show();
            } else $('#ubox-next').unbind().hide();
            // keyboard navigation
            $(document).keydown(function(e) {
                // left -> previous
                if ( e.keyCode == 37 )
                    if ( o.active != 0 ) {
                        o.active = o.active - 1;
                        m.get(o)
                        $(document).unbind();
                    }
                // right -> next
                if ( e.keyCode == 39 )
                    if ( o.active != ( o.media.length - 1 ) ) {
                        o.active = o.active + 1;
                        m.get(o);
                        $(document).unbind();
                    }
            });            
        },
        close: function(){
            $('#ubox').remove();
            $('#ubox-overlay').fadeOut(function() {
                $(this).remove();
            });
            $('embed, object, select').css({
                'visibility' : 'visible'
            });            
        }
    };
    $.fn.ubox = function(o) {
        // Options
        o = $.extend({
            loader    : 'loader.gif',
            previous  : 'ubox-sprite.png',
            next      : 'ubox-sprite.png',
            close     : 'ubox-sprite.png',
            color     : '#333',
            background: '#fff',
            opacity   : .8,
            padding   : 5,
            speed     : 300,
            outClick  : false,
            media     : [],
            active    : 0
        }, o);
        objects = this;
        return this.unbind('click').click(function(e){
            m.open(e,$(this),o)
            });
    };
})( jQuery );
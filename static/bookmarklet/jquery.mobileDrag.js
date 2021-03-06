(function( $ ){
    // A mobile and trackpad friendly
    // Drag and Drop jQuery plugin
    // Written by David Mauro
    
    var default_settings = {
        draggingClass        : 'dragging',
        droppingClass        : 'dropping',
        draggableClass        : 'draggable',
        dropTargetClass        : 'drop_target',
        targetClass            : null,
        drag                : function(){},
        endDrag                : function(){},
        drop                : function(){},
        move                : function(){},
        threshold            : 1,
        intersectMode        : "touch",
        easyDrag            : true, // False will disable "click to drag - click to drop"
        constrainX            : false,
        constrainY            : false,
        limitDrops            : true,
        targets             : {},
        onScreenTargets     : [],
        handle              : null,
    };
    
    var previous_state = {
        lastX        : 0,
        lastY        : 0,
        lastLeft    : 0,
        lastTop        : 0,
    };
    
    var methods = {
        // INITIATE FUNCTION
        init: function(params) {
            var settings = $.extend({}, default_settings, params);
            var that = this;
            // Initialize data if not already available
            data = $(this).data("mobileDrag");
            if (!data) {
                $(this).data("mobileDrag", {
                    dragDistance    : 0,
                    dragStart        : null,
                    originalPos        : that.position(),
                    currentPos      : null,
                    clickPosition    : null,
                    settings        : settings,
                });
            }
            
            settings.defineTargets = function() {
                $("."+settings.targetClass).each(function(index) {
                    var offset = $(this).offset();
                    settings.targets[index] = {
                        top     : offset.top,
                        left    : offset.left,
                        width   : $(this).outerWidth(),
                        height  : $(this).outerHeight(),
                    }
                });
                // Get on screen targets (vertically only, horizontal assumed)
                $.each(settings.targets, function(i) {
                    if (
                        (settings.targets[i].top >= $(window).scrollTop() && settings.targets[i].top <= $(window).scrollTop() + $(window).height())
                        ||
                        (settings.targets[i].top + settings.targets[i].height >= $(window).scrollTop() && settings.targets[i].top + settings.targets[i].height <= $(window).scrollTop() + $(window).height())
                    ) {
                        settings.onScreenTargets.push(i);
                    }
                });
            };
            
            var touchEventFix = function(e) {
                // Fix for jQuery touch event conflict (thank you: http://www.the-xavi.com/articles/trouble-with-touch-events-jquery)
                if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
                    e = e.originalEvent.touches[0];
                } else if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
                    e = e.originalEvent.changedTouches[0];
                }
                return e;
            };
            
            var updateDrag = function(e) {
                // Set the position and drag distance
                var new_pos_x = e.pageX - that.parent().offset().left - that.data("mobileDrag").clickPosition.left;
                if (settings.constrainX) {
                    var left_constraint = that.data("mobileDrag").originalPos.left - settings.constrainX[0];
                    var right_constraint = that.data("mobileDrag").originalPos.left + settings.constrainX[1];
                    if (new_pos_x >= left_constraint && new_pos_x <= right_constraint) {
                        that.css({left:new_pos_x});
                    } else if (new_pos_x < left_constraint) {
                        that.css({left:left_constraint});
                    } else if (new_pos_x > right_constraint) {
                        that.css({left:right_constraint});
                    }
                } else {
                    that.css({left:new_pos_x});
                }
                var new_pos_y = e.pageY - that.parent().offset().top - that.data("mobileDrag").clickPosition.top;
                if (settings.constrainY) {
                    var top_constraint = that.data("mobileDrag").originalPos.top - settings.constrainY[0];
                    var bottom_constraint = that.data("mobileDrag").originalPos.top + settings.constrainY[1];
                    if (new_pos_y >= top_constraint && new_pos_y <= bottom_constraint) {
                        that.css({top:new_pos_y});
                    } else if (new_pos_y < top_constraint) {
                        that.css({top:top_constraint});
                    } else if (new_pos_y > bottom_constraint) {
                        that.css({top:bottom_constraint});
                    }
                } else {
                    that.css({top:new_pos_y});
                }
                if (that.data("mobileDrag").dragDistance < settings.threshold) {
                    that.data("mobileDrag").dragDistance = Math.floor(Math.sqrt(Math.abs(Math.pow((e.pageX - that.data("mobileDrag").dragStart.left),2) + Math.pow((e.pageY - that.data("mobileDrag").dragStart.top),2))));
                }
                // Update data
                that.data("mobileDrag").currentPos = that.position();
            };
            
            // Bind event handlers
            var target = settings.handle || this;
            return target.bind({
                touchstart: function(e) {
                    var currently_dragging = $("body ."+settings.draggingClass);
                    if (currently_dragging.length) {
                        currently_dragging.mobileDrag('endDrag');
                        if (currently_dragging[0] == that[0]) {
                            return false;
                        }
                    }
                    e.preventDefault();
                    e = touchEventFix(e);
                    // Check if it's draggable
                    if (that.is("." + settings.draggableClass)) {
                        that.data("mobileDrag").dragStart = that.position();
                        that.data("mobileDrag").dragDistance = 0;
                        that.data("mobileDrag").clickPosition = {left:e.pageX - that.offset().left, top:e.pageY - that.offset().top};
                        that.css({left:that.position().left, top:that.position().top});
                        settings.drag.apply();
                        if (settings.targetClass) {
                            settings.defineTargets(true);
                            $(window).bind("scroll", settings.defineTargets);
                        }
                    }
                },
                touchmove: function(e) {
                    e.preventDefault();
                    e = touchEventFix(e);
                    if (that.is("."+settings.draggableClass)) {
                        updateDrag(e);
                        settings.move.apply();
                    }
                },
                touchend: function(e) {
                    if (that.data("mobileDrag").dragDistance >= settings.threshold || !settings.easyDrag) {
                        that.mobileDrag('endDrag');
                    } else {
                        $("body").one("click", function(evt) {
                            evt.preventDefault();
                            evt = touchEventFix(evt);
                            that.css({left:evt.pageX - that.parent().offset().left - that.data("mobileDrag").clickPosition.left, top:evt.pageY - that.parent().offset().top - that.data("mobileDrag").clickPosition.top});
                            that.mobileDrag('endDrag');
                        });
                    }
                },
                touchcancel: function(e) {
                    that.mobileDrag('endDrag');
                },
                mousedown: function(e) {
                    var currently_dragging = $("body ."+settings.draggingClass);
                    if (currently_dragging.length) {
                        currently_dragging.mobileDrag('endDrag');
                        return false;
                    }
                    e.preventDefault();
                    // Check if it's draggable
                    if (that.is("." + settings.draggableClass)) {
                        that.data("mobileDrag").dragStart = that.position();
                        that.data("mobileDrag").dragDistance = 0;
                        that.data("mobileDrag").clickPosition = {left:e.pageX - that.offset().left, top:e.pageY - that.offset().top};
                        that.css({left:that.position().left, top:that.position().top});
                        settings.drag.apply();
                        if (settings.targetClass) {
                            settings.defineTargets(true);
                            $(window).bind("scroll", settings.defineTargets);
                        }
                        $(window).bind("mousemove", function(evt) {
                            // Once the user starts moving the target, it's droppable
                            if (that.data("mobileDrag").dragDistance > settings.threshold) { that.addClass(settings.droppingClass); }

                            updateDrag(evt);

                            // Check for collisions
                            if (settings.targetClass) {
                                var validTargets = that.mobileDrag('collideCheck');
                                $("." + settings.dropTargetClass).removeClass(settings.dropTargetClass);
                                if (validTargets && validTargets.length > 0) {
                                    if (settings.limitDrops) {
                                        validTargets[0].addClass(settings.dropTargetClass);
                                    } else {
                                        $.each(validTargets, function(i) {
                                            validTargets[i].addClass(settings.dropTargetClass);
                                        });
                                    }
                                }
                            }
                            settings.move.apply();
                        });
                        $(window).one("mouseup", function() {
                        // In case the target is no longer under the mouse
                            that.mobileDrag('endDrag');
                        });
                    }
                },
                mouseup: function(e) {
                    $(window).unbind("mouseup");
                    if (that.is("."+settings.draggableClass)) {
                        if (!settings.easyDrag || that.data('mobileDrag').dragDistance > settings.threshold) {
                            that.mobileDrag('endDrag');
                        } else {
                            $("body").one("click", function(evt) {
                                evt.preventDefault();
                                that.css({left:evt.pageX - that.parent().offset().left - that.data("mobileDrag").clickPosition.left, top:evt.pageY - that.parent().offset().top - that.data("mobileDrag").clickPosition.top});
                                that.mobileDrag('endDrag');
                            });
                        }
                    }
                },
                click: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        },
        
        // ENDING DRAG CHECK FOR DROP OR ENDDRAG
        endDrag: function() {
            var drag = this,
                settings = this.data("mobileDrag").settings;
            $("body").unbind("click");
            $(window).unbind("mousemove");
            $(window).unbind("scroll", settings.defineTargets);
            drag.removeClass(settings.droppingClass);
            // Check for targets and either apply drop or end the drag
            if (settings.targetClass){
                var validTargets = drag.mobileDrag('collideCheck');
            }
            if (validTargets && validTargets.length > 0) {
                settings.drop.apply(null, [((settings.limitDrops) ? validTargets[0] : validTargets)]);
            } else {
                settings.endDrag.apply();
            }
            
            $("." + settings.dropTargetClass).removeClass(settings.dropTargetClass);
        },
        
        // COLLISION CHECK FUNCTION
        collideCheck: function() {
            var settings = this.data("mobileDrag").settings;
            var validTargets = Array();
            var drag = this;
            var drag_offset = this.offset();
            var drag_width = this.outerWidth();
            var drag_height = this.outerHeight();
            var a = 0;
            $.each(settings.onScreenTargets, function() {
                var intersects = false;
                var that = settings.targets[this];
                // Check for intersection
                var x1 = drag_offset.left, x2 = x1 + drag_width,
                    y1 = drag_offset.top,  y2 = y1 + drag_height;
                var l = that.left, r = l + that.width,
                    t = that.top,  b = t + that.height;

                switch(settings.intersectMode) {
                    case("touch"):
                        intersects =(
                                    (y1 >= t && y1 <= b) ||
                                    (y2 >= t && y2 <= b) ||
                                    (y1 < t && y2 > b)
                                    ) && (
                                    (x1 >= l && x1 <= r) ||
                                    (x2 >= l && x2 <= r) ||
                                    (x1 < l && x2 > r)
                                );
                        break;

                    default:
                        intersects = false;
                        break;
                }
                var intersectArea = (Math.max(x1, l) - Math.min(x2, r)) * (Math.max(y1, t) - Math.min(y2, b));
                if (intersects && settings.limitDrops) {
                    if (intersectArea > a) {
                        validTargets = Array($($("."+settings.targetClass)[this]));
                        a = intersectArea;
                    }
                }
                else if (intersects) {
                    validTargets.push($($("."+settings.targetClass)[this]));
                }
            });
            return validTargets;
        }
    }
        
    $.fn.mobileDrag = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.mobileDrag');
        }   
    };
})( canv_as_jQuery );

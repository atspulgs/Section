/* -----------------------------------------------------------------------------
 * Author:  Atspulgs
 * Version: 0.1
 * -----------------------------------------------------------------------------
 * --- Features ----------------------------------------------------------------
 * ! Formats Sections (HTML + styles) - DONE
 * ! Javascript based Hover efect for the title - IN PROGRESS
 * ! Option to start expanded or collapsed - DONE
 * ! Collapses and Expands upon triggering click event on the title - DONE
 * ! Animate the collapse and expansion - DONE
 * --- Notes -------------------------------------------------------------------
 * animationState = open/closed
 * --- Changelog ---------------------------------------------------------------
 * 
 * --- To Do -------------------------------------------------------------------
 * !Fix the text highlighting when clicking.
 * !Write up comments for the thing.
 * !Write a couple a styles as something to add optionally.
 * !Write up a guide in github.
 * !Consider doing something about any extra content added to the section.
 * --- Formatting --------------------------------------------------------------
 * <div class="_section">
 *     <div class="_section_title">Section Title</div>
 *     <div class="_section_content">Content</div>
 * </div>
 * ---------------------------------------------------------------------------*/


function Section() {
    //Properties
    this.default_title          = "Section";
    this.start_closed           = true;
    this.title_hover            = true;
    this.animate                = true;
    this.animation_timer_delay  = 10;
    this.animation_timer_chunks = 20;
    this.title_bg_default       = "rgba(255,255,255,1.0)";
    this.title_bg_hover         = "rgba(255,0,255,1.0)";
    
    //Making sure the DOM has loaded.
    document.addEventListener("DOMContentLoaded", function(event) {
        if(event) {
            this.generate();
        }
    }.bind(this));
    
    //Methods
    // Formats and adjusts the page to abide by the required format
    this.generate               = function() {
        var sections = document.querySelectorAll('div[class~="_section"]');
        if(sections)
            sections.forEach(function(element) {
                if(element.touched) return;
                var title   = element.querySelector('div[class~=_section_title]');
                var content = element.querySelector('div[class~=_section_content]');
                if(title && !content) {
                    title = element.removeChild(title);
                    content = document.createElement('div');
                    content.className = "_section_content";
                    content.innerHTML = element.innerHTML;
                    element.innerHTML = "";
                    element.appendChild(title);
                    element.appendChild(content);
                } else if(!title && content) {
                    title = document.createElement('div');
                    title.className = "_section_title";
                    title.innerHTML = this.default_title;
                    element.insertBefore(content);
                } else if(!title && !content) {
                    content = document.createElement('div');
                    title = document.createElement('div');
                    title.className = "_section_title";
                    title.innerHTML = this.default_title;
                    content.className = "_section_content";
                    content.innerHTML = element.innerHTML;
                    element.innerHTML = "";
                    element.appendChild(title);
                    element.appendChild(content);
                }
                
                element.animationState = "open";
                
                element.style.overflow = "hidden";
                title.style.backgroundColor = this.title_bg_default;
                title.style.cursor = "pointer";
                
                if(this.title_hover) {
                    title.addEventListener("mouseover", onOver.bind(this));
                    title.addEventListener("mouseout", onOut.bind(this));
                }
                
                title.addEventListener("click", onClick.bind(this));
                
                if(this.start_closed) {
                    var an = this.animate?true:false;
                    if(an)
                        this.animate = false;
                    title.dispatchEvent(new Event("click"));
                    if(an)
                        this.animate = true;
                }
                
                element.touched = true;
            }, this);
    };
    
    function onClick(e) {
        var title = e.target;
        var section = title.parentNode;
        if(section.animationState === "open")
            section.animationState = "closed";
        else section.animationState = "open";
        var content = section.querySelector('div[class~=_section_content]');
        var title_h = parseInt(title.offsetHeight);
        var section_h = parseInt(section.clientHeight);
        var content_h = parseInt(content.clientHeight);
        if(this.animate) {
            if(section.animationId) {
                clearInterval(section.animationId);
                section.animationId = false;
            }
            var start, end, chunk_size;
            if(section.animationState === "open") {
                start = title_h;
                end = (content_h+title_h);
                chunk_size = ((end - start) / this.animation_timer_chunks).toFixed(0);
                chunk_size = parseInt((chunk_size <= 0)? 1 : chunk_size); 
            } else if(section.animationState === "closed") {
                start = section_h;;
                end = title_h;
                chunk_size = ((end - start) / this.animation_timer_chunks).toFixed(0);
                chunk_size = parseInt((chunk_size >= 0)? -1 : chunk_size);
            } else {
                console.err("Section is in an unexpected state: "+section.animationState);
                return;
            }
            section.animationId = setInterval(frame, this.animation_timer_delay);
            function frame() {
                if(section.animationState === "open" && start >= end) {
                    start = end;
                    clearInterval(section.animationId);
                    section.animationId = "undefined";
                } else if(section.animationState === "closed" && start <= end) {
                    start = end;
                    clearInterval(section.animationId);
                    section.animationId = "undefined";
                } else {
                    start += chunk_size;
                }
                section.style.height = start+"px";
            }
        } else {
            if(section_h > title_h)
                section.style.height = title_h+"px";
            else section.style.height = (title_h+content_h)+"px";
        }
    }
    function onOver(e) {
        e.target.style.backgroundColor = this.title_bg_hover;
    }
    function onOut(e) {
        e.target.style.backgroundColor = this.title_bg_default;
    }
    
    //Setters
    this.setDefaultTitle        = function(title) {
        if(title instanceof String) {
            this.default_title = title;
            return true;
        } else return false;
    };
    this.setStartingClosed      = function(enable) {
        if(enable instanceof Boolean) {
            this.start_closed = enable;
            return true;
        } else return false;
    };
    this.setHover               = function(enable) {
        if(enable instanceof Boolean) {
            this.title_hover = enable;
            return true;
        } else return false;
    };
    this.setAnimation           = function(enable) {
        if(enable instanceof Boolean) {
            this.animate = enable;
            return true;
        } else return false;
    };
    // Timer delay cannot go lower than 10 miliseconds.
    this.setTimerDelay          = function(delay) {
        if(delay instanceof Number) {
            if(delay < 10) delay = 10;
            this.animation_timer_delay = delay;
            return true;
        } else return false;
    };
    // Timer chunks (iterations) of the animation.
    // Should there be a maximum????
    this.setTimerChunks         = function(chunks) {
        if(chunks instanceof Number) {
            if(chunks < 1) chunks = 1;
            this.animation_timer_chunks = chunks;
            return true;
        } else return false;
    };
    this.setTitleDefaultBG      = function(red, green, blue, alpha) {
        if(red instanceof Number && green instanceof Number && blue instanceof blue && alpha instanceof alpha) {
            if(red > 255)       red     = 255;
            else if(red < 0)    red     = 0;
            if(green > 255)     green   = 255;
            else if(green < 0)  green   = 0;
            if(blue > 255)      blue    = 255;
            else if(blue < 0)   blue    = 0;
            if(alpha > 1.0)     alpha   = 1.0;
            else if(alpha < 0)  alpha   = 0;
            this.title_bg_default = "rgba("+red+","+green+","+blue+","+alpha+")";
            return true;
        } else return false;
    };
    this.setTitleHoverBG        = function(red, green, blue, alpha) {
        if(red instanceof Number && green instanceof Number && blue instanceof blue && alpha instanceof alpha) {
            if(red > 255)       red     = 255;
            else if(red < 0)    red     = 0;
            if(green > 255)     green   = 255;
            else if(green < 0)  green   = 0;
            if(blue > 255)      blue    = 255;
            else if(blue < 0)   blue    = 0;
            if(alpha > 1.0)     alpha   = 1.0;
            else if(alpha < 0)  alpha   = 0;
            this.title_bg_hover = "rgba("+red+","+green+","+blue+","+alpha+")";
            return true;
        } else return false;
    };
    
    //Getters
    this.getDefaultTitle        = function() {
        return this.default_title;
    };
    this.getStartingClosed      = function() {
        return this.start_closed;
    };
    this.getHover               = function() {
        return this.title_hover;
    };
    this.getAnimation           = function() {
        return this.animate;
    };
    this.getTimerDelay          = function() {
        return this.animation_timer_delay;
    };
    this.getTimerChunks         = function() {
        return this.animation_timer_chunks;
    };
    this.getDefaultBG           = function() {
        return this.title_bg_default;
    };
    this.getHoverBG             = function() {
        return this.title_bg_hover;
    };
};
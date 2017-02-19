/* -----------------------------------------------------------------------------
 * Author:  Atspulgs
 * Version: 0.4.1
 * -----------------------------------------------------------------------------
 * Tested on the follwoing browsers:
 * ! Chrome - Fully supported
 * ! Firefox - Fully supported
 * ! IE 11 - Fully supported
 * ! Edge - Fully supported
 * ! Maxthon - Fully supported
 * --- Features ----------------------------------------------------------------
 * ! Formats Sections (HTML + styles) - DONE
 * ! Javascript based Hover efect for the title - DONE
 * ! Option to start expanded or collapsed - DONE
 * ! Collapses and Expands upon triggering click event on the title - DONE
 * ! Animate the collapse and expansion - DONE
 * ! Add IE 11 Support - DONE
 * ! Add support for Edge - DONE
 * --- Notes -------------------------------------------------------------------
 * animationState = open/closed
 * My default I have disabled the user select on the title.
 * --- Changelog ---------------------------------------------------------------
 * 15/01/2017 - innitial release of the code.
 * 16/01/2017 - Changed from forEach to for loop as its better supported across browsers
 *            - Fixed the setters, none fo them worked cause I used instance of rather than typeof
 *            - Added to more setters, they still need to be worked on but they provide more power as they are.
 *            - Changed the Default background from white to inherit.
 * 17/01/2017 - Fixed an issue found in FF 45 ESR. Reference error.
 * 18/01/2017 - Added a method for updating the document with new sections if they were added afterwards.
 *            - Added the option to not auto generate the sections.
 *            - Adjusted one of the methods to now force generate. Regens previosuly generated code.
 *            - Made sure that no lingering content can be added.
 * --- To Do -------------------------------------------------------------------
 * !Write up comments for the thing.
 * !Write a couple a styles as something to add optionally.
 * !Write up a guide in github.
 * !Add an optional button to disable user select on the title. (on the fly)
 * --- Formatting --------------------------------------------------------------
 * <div class="_section">.
 *     <div class="_section_title">Section Title</div>
 *     <div class="_section_content">Content</div>
 * </div>
 * ---------------------------------------------------------------------------*/


function Section(auto = true) {
    //Properties
    this.default_title          = "Section";
    this.start_closed           = true;
    this.title_hover            = true;
    this.animate                = true;
    this.animation_timer_delay  = 10;
    this.animation_timer_chunks = 20;
    this.title_bg_default       = "inherit";
    this.title_bg_hover         = "rgba(240,240,240,1.0)";
    this.user_select            = true;
    this.user_selector          = true;
    
    //Making sure the DOM has loaded.
    if(auto) document.addEventListener("DOMContentLoaded", function(event) {
        if(event) {
            this.generate();
        }
    }.bind(this));
    
    //Methods
    /**
     * Force generates and formats the sections.
     * @param {type} force
     * @returns {undefined}
     */
    this.generate = function(force = true) {
        var sections = document.querySelectorAll('div[class~="_section"]');
        if(sections)
            for(var i = 0; i < sections.length; ++i) {
                var element = sections[i];
                if(element.touched && !force) return;
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
                    content = element.removeChild(content);
                    element.innerHTML = "";
                    element.appendChild(title);
                    element.appendChild(content);
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
                if(this.user_select) {
                    title.style.userSelect = "none";
                    title.style.MozUserSelect = "none";
                    title.style.WebkitUserSelect = "none";
                }
                
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
            }
    };
    
    /**
     * Updates the content. In other words, if new section divs are added they can be
     * modded in with this without regenerating the whole set of sections. 
     * @returns {undefined}
     */
    this.update = function() {
        this.generate(false);
    };
    
    function onClick(e) {
        if(!e.target.classList.contains("_section_title")) return;
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
            section.animationId = setInterval(function () {
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
            }, this.animation_timer_delay);
        } else {
            if(section_h > title_h)
                section.style.height = title_h+"px";
            else section.style.height = (title_h+content_h)+"px";
        }
    }
    function onOver(e) {
        if(e.target.classList.contains("_section_title"))
            e.target.style.backgroundColor = this.title_bg_hover;
    }
    function onOut(e) {
        if(e.target.classList.contains("_section_title"))
            e.target.style.backgroundColor = this.title_bg_default;
    }
    
    //Setters
    this.setDefaultTitle = function(title) {
        if(typeof title === "string") {
            this.default_title = title;
            return true;
        } else return false;
    };
    this.setTitleUserSelect = function(enable) {
        if(typeof enable === "boolean") {
            this.user_select = enable;
            return true;
        } else return false;
    };
    this.setStartingClosed = function(enable) {
        if(typeof enable === "boolean") {
            this.start_closed = enable;
            return true;
        } else return false;
    };
    this.setHover = function(enable) {
        if(typeof enable === "boolean") {
            this.title_hover = enable;
            return true;
        } else return false;
    };
    this.setAnimation = function(enable) {
        if(typeof enable === "boolean") {
            this.animate = enable;
            return true;
        } else return false;
    };
    this.setTimerDelay = function(delay) {
        if(typeof delay === "number") {
            if(delay < 10) delay = 10;
            this.animation_timer_delay = delay;
            return true;
        } else return false;
    };
    this.setTimerChunks = function(chunks) {
        if(typeof chunks === "number") {
            if(chunks < 1) chunks = 1;
            this.animation_timer_chunks = chunks;
            return true;
        } else return false;
    };
    this.setTitleDefaultBGinRGBA = function(red, green, blue, alpha) {
        if(typeof red === "number" && typeof green === "number" && typeof blue === "number" && typeof alpha === "number") {
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
    this.setTitleHoverBGinRGBA = function(red, green, blue, alpha) {
        if(typeof red === "number" && typeof green === "number" && typeof blue === "number" && typeof alpha === "number") {
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
    //consider parse function...
    this.setTitleDefaultBG = function(value) {
        //Still need checks here for RGBA, RGB, keywords as well as colors and hashes
        this.title_bg_hover = value;
    };
    this.setTitleHoverBG = function(value) {
        //Still need checks here for RGBA, RGB, keywords as well as colors and hashes
        this.title_bg_hover = value;
    };
    
    //Getters
    this.getDefaultTitle = function() {
        return this.default_title;
    };
    this.getTitleUserSelect = function() {
        return this.user_select;
    };
    this.getStartingClosed = function() {
        return this.start_closed;
    };
    this.getHover = function() {
        return this.title_hover;
    };
    this.getAnimation = function() {
        return this.animate;
    };
    this.getTimerDelay = function() {
        return this.animation_timer_delay;
    };
    this.getTimerChunks = function() {
        return this.animation_timer_chunks;
    };
    this.getDefaultBG = function() {
        return this.title_bg_default;
    };
    this.getHoverBG = function() {
        return this.title_bg_hover;
    };
};
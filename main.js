/*
 *  <div class="_section">
 *      <div class="_section_title">Section Title</div>
 *      <div class="_section_content">Content</div>
 *  </div>
 *  
 *  
 */

const SECTION_TIMER_DELAY = 10;
const SECTION_TIMER_CHUNKS = 20;

class Section {
    constructor(section_start_closed = true, section_title_hover = true, animation = true) {
        this.default_title          = "Section";
        this.section_start_closed   = section_start_closed;
        this.section_title_hover    = section_title_hover;
        this.animation              = animation;
        this.titleBGColor           = "rgba(255,255,255,1.0)";
        this.titleBGColorHover      = "rgba(255,255,255,1.0)";
        document.addEventListener("DOMContentLoaded", function(event) {
            if(event) {
                this.init();
            }
        }.bind(this));
    }
    
    init() {
        var sections = document.querySelectorAll('div[class~="_section"]');
        if(sections) sections.forEach(function(element) {
            var title   = element.querySelector('div[class~=_section_title]');
            var content = element.querySelector('div[class~=_section_content]');
            if(title && !content) {
                content = document.createElement('div');
                content.className = "_section_content";
                title = element.removeChild(title);
                content.innerHTML = element.innerHTML;
                element.innerHTML = "";
                element.appendChild(title);
                element.appendChild(content);
            } else if(!title && content) {
                content = element.removeChild(content);
                var temp = element.innerHTML;
                element.innerHTML = "";
                content.innerHTML += "<br/>"+temp;
                title = document.createElement('div');
                title.className = "_section_title";
                title.innerHTML = this.default_title;
                element.appendChild(title);
                element.appendChild(content);
            } else if(!title && !content) { 
                content = document.createElement('div');
                content.className = "_section_content";
                content.innerHTML = element.innerHTML;
                element.innerHTML = "";
                title = document.createElement('div');
                title.className = "_section_title";
                title.innerHTML = this.default_title;
                element.appendChild(title);
                element.appendChild(content);
            }
            
            //Section Styles
            element.style.overflow      = "hidden"; //must have
            
            
            //Section Title Styles
            title.style.backgroundColor = this.titleBGColor; //must have
            title.style.cursor          = "pointer"; //should have
            
            //Section Content Styles
            
            //Hover Style
            if(this.section_title_hover) {
                title.addEventListener("mouseover", function(event) {
                    var section_title = event.target;
                    section_title.style.backgroundColor = this.titleBGColorHover;
                }.bind(this));
            
                title.addEventListener("mouseout", function(event) {
                    var section_title = event.target;
                    section_title.style.backgroundColor = this.titleBGColor;
                }.bind(this));
            }
            
            title.addEventListener("click", function(event) {
                var section_title = event.target;
                var section = section_title.parentNode;
                var section_content = section.querySelector('div[class~=_section_content]');
                var top_section_height = section_title.offsetHeight;
                var bottom_section_height = section_content.clientHeight;
                var section_height = section.clientHeight;
                //Must rethink the way animation is done...
                //Should give it more direct bounds it cant go out of.
                if(this.animation) {
                    if(section_title.animationId) {
                        clearInterval(section_title.animationId);
                        section_title.animationId = false;
                    }
                    var start, end, mode;
                    if(section_height > top_section_height) {
                        end = parseInt(top_section_height);
                        start = parseInt(section_height);
                        mode = 1;
                    } else {
                        end = (parseInt(top_section_height)+parseInt(bottom_section_height));
                        start = parseInt(top_section_height);
                        mode = 0;
                    }
                    var d = ((end - start)/SECTION_TIMER_CHUNKS).toFixed(0);
                    d = (d == 0)? ((mode===1)?1:-1):d;
                    section_title.animationId = setInterval(frame, SECTION_TIMER_DELAY);
                    function frame() {
                        //console.log("Running... [Mode="+mode+", Start="+start+", End="+end+"]");
                        if(mode === 1 && start <= end) {
                            clearInterval(section_title.animationId);
                            section_title.animationId = false;
                            start = end;
                        } else if(mode === 0 && start >= end) {
                            clearInterval(section_title.animationId);
                            section_title.animationId = false;
                            start = end;
                        } else {
                            start += parseInt(d);
                        }
                        section.style.height = start+"px";
                    };
                } else {
                    if(section_height > top_section_height)
                        section.style.height = top_section_height+"px";
                    else section.style.height = (parseInt(top_section_height)+parseInt(bottom_section_height))+"px";
                }
            }.bind(this));
            
            if(this.section_start_closed) {
                var an = this.animation?true:false;
                if(an)this.animation = false;
                title.dispatchEvent(new Event("click"));
                if(an)this.animation = true;
            }
        },this);
    }
    
    setTitleBackground(bg) {
        this.titleBGColor = bg;
    }
    
    setTitleHoverBackground(bg) {
        this.titleBGColorHover = bg;
    }
}
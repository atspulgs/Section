## Installation
1. Download the Section.js file and add it in your project.
2. Link the Section.js file in your project.
3. Instantiate the Section object "new Section();".
4. Add "_section" to your div class attribute. Note that this is the div that's going to be sectioned.

_Ideally you want to have the following formatting to begin with._

    <div class="_section">
      <div class="_section_title">Section Title</div>
      <div class="_section_content">This is the text within the section</div>
    </div>

## Styles
I have tried to leave as much open for the styling. So the only styles that were absolutely needed for the function are added to the elements directly. You can adjust some of them via the options provided in the javascript itself.
As for the rest of it, simply create styles in your style sheets for the following classes:
* _section
* _section_title
* _section_content

Although the names should be unique enough to not mess with other styles, you should still be careful. I would use a more specific selectors, such as:
* div[class~="_section"]
* #mySectionedContent>div[class~="_section"] where "mySectionedContent" is an id of the parent of the sections.
* div[class~="_section"]>div[class~="_section_title"]
* #mySectionedContent>div[class~="_section"]>div[class~="_section_content"] where "mySectionedContent" is an id of the parent of the sections.

Note: currently the code will not check for minimum and maximum heights so adding them may break the functionality. This is something I plan to add in the future.

## Options
You have the following options that you can change for the script itself.

### Constructors
The construction of the Object can be achieved in a couple of ways.
1. default construction: `new Section()`
2. manual formatting construction: `new Section(false);`

### Properties
Although I do not recommend doing this, you have the access to the objects parameters directly as I did not take the effort to hide them. I don't believe its necessary to do so for properties.
* section.default_title = "Section"

If _section_title did not exist in _section div, it will be generated and this will be the default string passed into its innerHTML
* section.start_closed = true

If this is false, the page will have all its sections in an expanded view rather than collapsed.
* section.title_hover = true

This variable determines if the hover animation should be applied. By default I have added a simple one, but you may want to disable it if you wish to use styles for it. Or you may want to apply other javascript based hover animation.
* section.animate = true

This enables the animation of expansion and collapse. You can disable this for performance, preference or in favor for CSS based animation. Other javascript animations would be possible too, but, you should then start the formatting process manually by disabling its auto call. Disable auto call: `var section = new Section(false);`. Call the formatting process: `section.generate();`. _Note that some of these features are planned for now._
* section.animation_timer_delay = 10

This specifies how often an animation frame will be called. It is defaulted to 10ms and I would not really lower the number much. Use with caution and to your own peril. I recommend using a setter if there is a desire to adjust this number.
* section.animation_timer_chunks = 20

Timer chunks are the amount of frames the animation will try to use. This should not be lower than 1. It will max out at the heights pixel count. This is also a property you should not change directly. Please use a setter.
* section.title_bg_default = "inherit"

This property will change the initial title background color. By default it will inherit its parents. I recommend using the setters.
* section.title_bg_hover = "rgba(240,240,240,1.0)"

This property is the same as title_bg_default with the exception that it will be applied upon :hover.
* section.user_select = true

This property allows or disallows user selection (selecting the text) of the title. By default I do not let users select the title as it looks bad when toggling.

### Methods

### Setters

### Getters

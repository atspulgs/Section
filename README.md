## Installation
1. Download the Section.js file and add it in your project.
2. Link the Section.js file in your project.
3. Instantiate the Section object "new Section();".
4. Add "_section" to your div class attribute. Note that this is the div that's going to be sectioned.

_Ideally you want to have the following formatting to begin with._

    <div class="_section" data-section-profile="profileName">
      <div class="_section_title">Section Title</div>
      <div class="_section_content">This is the text within the section</div>
    </div>

There are the following attirbutes that the code checks for.

    data-section-profile="profileName"
   
This is used to determine what profile does the individual section belong to.

    data-section-state="open|closed"
    
This is used to override the default close state. (expanded or closed) In a lot of ways, this is more intuitive than the object property.

Please use the Wiki for details...

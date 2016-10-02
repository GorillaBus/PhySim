# Physim

### A set of 'Physics Simulation' utilities for the browser Canvas

Hi! This repo holds an JavaScript + Gulp environment for developing physics experiments for the browser canvas.

This is the project on which I work while I studdy phisics, chemistry, computer graphics, fractals, AI and more. I go writing classes to do the math -like vectors and particles-, UI components -like the demo playback and a console I'll upload very soon-, projects/experiments -there are already some under /projects- and the environment to compile each project, transpile to Ecma5 and copy resources.

I just started with all this and hope to do some cool stuff (defining 'cool' as user interactive applications with which consiciousness of the universe where we live could be spread between those who, like me, area interested in what the fuck is going on in the universe and what the fuck life is).

The code is commented and should be quite self explanatory but I'm doing documentation that will also provide links to resources related with math and phisics.


## Classes provided

    Vector · (/src/lib/Vector.js)

    Lets you create vector objects and do different operations between them like adding, multiplying, dividing, etc. It can still have some possible optimizations (do you know any? I'll appretiate if you share!).


    Particle · (/src/lib/Particle.js)

    Handles particle objects and the relation between them. Particles can gravitate and spring between them. Also can be accelerated by vectors, de-celerated by friction and more. I managed to do some optimizations already but still looking for more possibilities.


    Utils · (/src/lib/Utils.js)

    Many helpful utilities that right now don't belong to a special entity/object class but will. Some of them are collision detection, managing random values, calculating ranges, distances, bezier curves and more. Much of this I did with great help from the YOUTUBE channel 'Coding Math' which not only I totally recommend, but also I encourage to donate for the so valuable resource the author is creating.

## AnimationPlayer.js · (/src/lib/AnimationPlayer.js)

    A very simple object that will handle the 'game loop'. You just pass it an update function where you will do your calculations and drawings and it will play it. You can PAUSE/RESUME playback with 'Esc'. I'm now working on a UI and more functionality I'm starting to require.



## Environment

    I use Gulp to compile and build the different projects, that are wrote in Ecma6. This is the directory structure:

    /src/lib    ·   ·   ·   ·   ·   ·   ·   Core classes
    /projects   ·   ·   ·   ·   ·   ·   ·   Projects
    /projects/<project>/lib     ·   ·   ·   Project level classes
    /projects/<project>/css     ·   ·   ·   Project level CSS
    /projects/<project>/images  ·   ·   ·   Project level images
    /build  ·   ·   ·   ·   ·   ·   ·   ·   Compiled and ready-to-run projects
    /tests  ·   ·   ·   ·   ·   ·   ·   ·   Tests (I do some TDD for classes mainly)


## Installing and compiling projects

    To install just do:

    # npm install

    To build all the projects do:

    # gulp build

    To build a particlar project:

    # gulp build -p <project-folder>

    To watch for changes while developing:

    # gulp watch -p <project-folder>


This is work in progress and any help, suggestions and contributions are very welcome.

Please, if you use some of the code / projects on this repo go ahead but let me know -I'd love to see what was implemented on!-

Cheers!

# Melodict

## Introduction

[Melodict](http://www.melodict.xyz/) is an ear training web app focused on melody dictation. The user listens to a melody and attempts to write it down via an interactive sheet music editor. 

<img width="1089" alt="Screen Shot 2022-03-17 at 14 50 25" src="https://user-images.githubusercontent.com/39847270/158745456-c1c0f409-4349-4875-a4e7-c36c7e171889.png">

## Technical stack

The backend side of Melodict is built using Ruby on Rails, and utilizes the following gems:
 
- Devise, for authentication
- Pundit, for authorization
- PostgreSQL, for database
- Cloudinary, for files cloud storage

On the frontend, Melodict uses 
- Bootstrap and Sass for styling
- Stimulus, for user interactions
- vexflow to display the sheet music
- ToneJS for audio feedback

## Features

### Audio playback

Sound is played when the user:
- listens to the question
- interacts with the sheet music
- plays back her own melody

Sound is generated using the JavaScript synthesizer [ToneJS](https://tonejs.github.io/), and [ToneJS/piano](https://github.com/tambien/Piano).

### User interaction with the sheet music

The user plays the game by inputing her answer on the sheet music using the keyboard keys. Keyboard shortcuts are accessible via the help button.
The sheet music display is generated using [VexFlow](https://www.vexflow.com/). VexFlow allowed us to generate an SVG representation of the sheet music. Then, we wrapped the SVG DOM inside a [Stimulus controller](https://stimulus.hotwired.dev/). This controller allowed us to:
- handle user interactions (clicks and keyboard presses) with the SVG elements
- update and redraw the SVG as the user modifies the music
- apply CSS styling to SVG elements to reflect user interactions and audio-visual feedback

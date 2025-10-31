# CI-Halloween-Hackathon-25 
![CI logo](https://codeinstitute.s3.amazonaws.com/fullstack/ci_logo_small.png)

## Introduction
Welcome to **Purranormal**!

 A spooky-themed hackathon project where we aim to find the *purr*-fect feline familiar for witches and spellcasters alike. Explore our unique selection of mystical cats, each with their own traits and personalities. Whether you're a seasoned witch or a budding sorcerer, Purranormal is here to help you discover your next magical companion.

## Wireframes
Below is the main wireframe for Purranormal — This sketch gently maps out the layout we imagined for the main app page.

![Wireframe screenshot](screenshots/wireframe.webp)

Figure: Wireframe showing layout, primary navigation and the placement of the main cat-matching cards.


## User Stories

## Technologies Used
- HTML:
- CSS:
- JavaScript:
- Python:
- Django:
- Django Admin:

## Features

## Credits 

### Content
- Generative AI tools were used in various parts of this project.

### Media

## Deployment Instructions

Deployment instructions for Heroku: 

Go to Heroku.com and implement the following steps in this order:

1. On the home page, click 'New' and in the dropdown, click on 'Create a new app'.
2. Add app name (This name must be unique, and have all lower case letters. Also use minus/dash signs instead of spaces.)
3. Select Region (Select the most relevant region, mine is Europe)
4. Click the button that says 'Create App'.
5. Click on the Deploy tab near the top of the screen.
6. Where is says Deployment Method click on Github.
7. Below that, search for your repo name and add that.
8. Click connect to the app.

Before clicking below on enable automatic deployment do the following:

1. Click on the settings tab
2. Click on reveal config vars.
3. Add in your variables from your env. files as key value pairs. 
4. Go back and click on the Deploy tab.

Before the app can be connected, push the following new files below to the repository. Go back in the terminal in your coding environment and add the following:

1. git status
2. git add requirements.txt
3. git commit -m "Add requirements.txt file"
4. git add Procfile (web: gunicorn adoptioncat.wsgi:application)
5. git commit -m "Add Procfile"
6. git push

Head back over to Heroku where the Deploy tab is.

1. Click 'Enable Automatic Deploys'
2. Click Deploy Branch. (Should be a main or master branch)
Heroku will receive code from Github and build app with the required packages. Hopefully once done the 'App has successfully been deployed message below' will appear. 
3. Click 'View' to launch the new app. 
The deployed link of the app is https://purranormal-26af1e8cdfe0.herokuapp.com/

## Meet the team
We are Codebusters, the team behind Purranormal:
- Hannah Olbrich - Scrum Master
- Dion 
- Aleksandra
- Magdalena
- Taiwo
- Fanxiang Meng

## Acknowledgements
- A big thank you to the Code Institute team and hackathon organisers for their continuous support and guidance throughout this project.
---
![CI logo](https://codeinstitute.s3.amazonaws.com/fullstack/ci_logo_small.png)
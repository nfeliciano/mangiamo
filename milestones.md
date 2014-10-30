# Milestones / Feature Progress #


#### Milestone 1 - Live End to End Demo ####
~~~~
Feature Name: Basic Setup
Description: Put the appropriate skeleton files in place so that features can be added
Requires: Reading tutorials and installing Node.js, Express.js, and getting Angular.js in place
Developers: Noel, Kevin, Lloyd
Status: Complete
Time Estimation: 4 Hours
Time Spent: 10 Hours
~~~~
~~~~
Feature Name: Backend Model Setup
Description: Create server files for meal and user models, add config file so password is not stored on main.js
Requires: Coding, using express & node, making sure files are being created in Mongo database
Developers: Noel, Kevin
Status: Complete
Time Estimation: 6 Hours
Time Spent: 26 Hours
~~~~
~~~~
Feature Name: Mock-Ups
Description: Basic mock-ups for two main screens
Requires: Photoshop mock-ups, layout and feature decisions
Developers: Chris
Status: Complete
Time Estimation: 4 Hours
Time Spent: 4 Hours
~~~~
~~~~
Feature Name: Launch Screen
Description: Creating HTML and CSS for landing / login / launch page
Requires: Creating basic markup and style sheets, learning and using bootstrap, adding "launch" functionality (this is, allowing input of user details that can be sent to the server).
Developers: Chris and Lloyd
Status: Functionality is finished, just need to make it look nice.
Time Estimation: 14 Hours
Time Spent: 30 Hours
~~~~
~~~~
Feature Name: Display the Restaurants
Description: Use a Google Map to display restaurants and food places around town
Requires: Working with the Google Maps API and displaying it on the front end
Developers: Jesper
Status: Food places are displayed, and if there is a meal in the database for that place, it is displayed with a custom pin
Time Estimation: 7 Hours
Time Spent: 5 Hours
~~~~
~~~~
Feature Name: Google Maps Geolocation
Description: Locate client through Geolocation Services
Requires: Google Maps API
Developers: Jesper
Status: Complete
Time Estimation: 2 Hours
Time Spent: 1.5 Hours
~~~~
~~~~
Feature Name: Google Maps Place Search
Description: Locate food vendors
Requires: Google Maps API
Developers: Jesper
Status: Complete
Time Estimation: 5 Hours
Time Spent: 1.5 Hours
~~~~
~~~~
Feature Name: Replace Google Maps Pins
Description: Create custom pins to display current meals on the map
Requires: Creating images for custom pins, research, Google API  
Developers: Jesper
Status: Completed
Time Estimation: 3 Hours
Time Spent: 3 Hours
~~~~
~~~~
Feature Name: Binary Search Array of Markers
Description: Was very cool function to binary search markers, turns out to be unfeasible because place id's are not just numbers
Requires: Not possible  
Developers: Jesper
Status: Discarded
Time Estimation: 3 Hours
Time Spent: 3 Hours
~~~~
~~~~
Feature Name: Radar Search
Description: Special place search for 200 places 
Requires: Research, Google API
Developers: Jesper
Status: Complete
Time Estimation: 3 Hours
Time Spent: 3 Hours
~~~~
~~~~
Feature Name: Text Search
Description: Text based place search 
Requires: Research, Google API  
Developers: Jesper
Status: Complete, but discarded
Time Estimation: 3 Hours
Time Spent: 3 Hours
~~~~
~~~~
Feature Name: Nearby Search
Description: Returns 3 pages of 20 locations nearby 
Requires: Images, research, Google API  
Developers: Jesper
Status: Complete, but discarded
Time Estimation: 4 Hours
Time Spent: 3 Hours
~~~~
~~~~
Feature Name: Pagination on Nearby search
Description: sort through the 3 pages from nearby search, try to get more that 60 total results (failed)
Requires: Images, research, Google API.  
Developers: Jesper
Status: Complete, but discarded
Time Estimation: 3 Hours
Time Spent: 7 Hours
~~~~
~~~~
Feature Name: Update Map as User Scrolls
Description: Destroy markers and search for new ones when the user moves to a different location on the map
Requires: Research, Google API.  
Developers: Jesper
Status: Complete
Time Estimation: 5 Hours
Time Spent: 4 Hours
~~~~
~~~~
Feature Name: Google API Research 
Description: Attempt to find more place results efficiently. We currently use radar search to find 200 places. Looking into embedded map to get a more default map look/functionality 
Requires: Research, Google API, Google Maps Embedded API
Developers: Jesper
Status: In Progress
Time Estimation: 20 Hours
Time Spent: 10 Hours
~~~~
~~~~
Feature Name: Remove Unecessary Google Maps Place's Markers
Description: Custom markers displaying current meals
Requires: Images, research, Google API.  
Developers: Jesper
Status: Complete
Time Estimation: 3 Hours
Time Spent: 3 Hours
~~~~
~~~~
Feature Name: See Scheduled Meals
Description: See any meals scheduled on the map
Requires: Overlaying on top of Google map, adding logic to database for retrieving meals (GET requests)
Developers: Chris, Jesper, Kevin, Noel
Status: Complete
Time Estimation: 15 Hours
Time Spent: 17 Hours
~~~~
~~~~
Feature Name: Scheduling Meals
Description: Be able to schedule a meal by using the map interface in conjunction with other views
Requires: Being able to add meals to database (POST request), different view for creating a meal (modal)
Developers: Chris, Noel, Kevin
Status: Created backend function for adding meals to the database
Time Estimation: 8 Hours
Time Spent: 2 Hours
~~~~
~~~~
Feature Name: Attendance Confirmation
Description: Be able to say 'I'm going to this meal'
Requires: Pushing to the backend that a user is going to a meal
Developers: Kevin
Status: Complete
Time Estimation: 5 Hours
Time Spent: 5 Hours
~~~~
~~~~
Feature Name: Who's Attending?
Description: Be able to see feature of the people attending a meal and return all users attending a meal from the database
Requires: Being able to track who's going to the meals in the database, temporary users in a database?, displaying those features
Developers: Kevin
Status: Complete
Time Estimation: 8 Hours
Time Spent: 5 Hours
~~~~
~~~~
Feature Name: Proper Redirection
Description: Redirect the user based on status of being logged in
Requires: UIRouter research, an AngularJS module
Developers: Lloyd
Status: Complete
Time Estimation: 8 Hours
Time Spent: 14 Hours
~~~~

#### Milestone 2 - Release Candidate ####
~~~~
Feature Name: AWS
Description: Get the app deployed onto AWS
Requires: AWS account, lots of tutorials
Developers: Kevin, Noel
Status: Done for the Proof of Concept
Time Estimation: 8
Time Spent: 8
~~~~
~~~~
Feature Name: Facebook and Google Authentication 
Description: Be able to sign-in using Facebook and Google API 
Requires: Interaction with API's, back-end logic for storing when user logs in through Facebook/Google
Developers: Kevin, Noel
Status: Buttons have been added and connected to FB and G+ API, backend done. Need to find a place for buttons on front end
Time Estimation: 8 Hours
Time Spent: 17 Hours
~~~~
~~~~
Feature Name: Meal Buddies 
Description: Be able to add 'meal buddies', be able to import from Facebook and add buddies in-app 
Requires: Backend work for relations 
Developers: Lloyd, Kevin, Noel
Status: Backed functionality complete, linked with front end, Need to do a UI overhaul
Time Estimation: 40 Hours
Time Spent: 19.5 Hours
~~~~
~~~~
Feature Name: Buddies on Map 
Description: If a buddy is eating somewhere and has checked in, display his face 
Requires: Get from backend if a person is your buddy, display face if so 
Developers:
Status: Not Started 
Time Estimation:
Time Spent: 0 Hours
~~~~


~~~~
Feature Name: Research other place frameworks
Description: See if anything other than google maps can be use full
Requires: Research
Status: Non seem to offer anythign imediatly helpfull
Developers: Jesper
Time Estimation: 2 Hours
Time Spent: 1 Hours
~~~~

~~~~
Feature Name: Yelp Research / setup
Description: Get yelp api working
Requires:Yelp account, Yelp api key, understanding yelp api 
Status: Yelp acount, and yelp api key check...
Developers: Jesper
Time Estimation: 6 Hours
Time Spent: 1 Hours
~~~~


~~~~
Feature Name: Faster Loading of Map
Description: faster map loading... faster updating
Requires:Less calls to Database, no holding for async calls inside pin creation 
Status: finished..for now
Developers: Jesper
Time Estimation: 6 Hours
Time Spent: 4 Hours
~~~~

~~~~
Feature Name: Remove Map Geolocation reliance 
Description: Enable the map to work regardless of geolocaion is allowed or not
Requires: Swapping around code scoping, adding checks and defaults, tracing current incorrect pathing 
Status: finished
Developers: Jesper
Time Estimation: 2 Hours
Time Spent: 1.5 Hours
~~~~

~~~~
Feature Name: Remove Map Geolocation reliance 
Description: Enable the map to work regardless of geolocaion is allowed or not
Requires: Swapping around code scoping, adding checks and defaults, tracing current incorrect pathing 
Status: finished
Developers: Jesper
Time Estimation: 2 Hours
Time Spent: 1.5 Hours
~~~~

~~~~
Feature Name: Map zoom limit
Description:  limits zoom
Requires: 
Status: finished
Developers: Jesper
Time Estimation: 0.1 Hours
Time Spent: 0.1 Hours
~~~~


#### Milestone 3 - Live Beta ####
~~~~
Feature Name: UI Overhaul 
Description: Fine tune the UI to make it as usable and easy to use as possible 
Requires: Front end work 
Developers:
Status: Not Started 
Time Estimation:
Time Spent: 0 Hours
~~~~
~~~~
Feature Name: Mobile 
Description: Have it working on mobile 
Requires: Either native development (objc and such) or PhoneGap or something similar
Developers:
Status: Not Started 
Time Estimation:
Time Spent: 0 Hours
~~~~
~~~~
Feature Name: Notify 
Description: Helping people in the same meal meet, likely through either notifications or some kind of display 
Requires: Access notification APIs on mobile 
Developers:
Status: Not Started 
Time Estimation:
Time Spent: 0 Hours
~~~~
~~~~
Feature Name: LinkedIn Auth 
Description: Include authentication using LinkedIn 
Requires: Figure out logic for how to tie it in with regular auth and Facebook auth
Developers: Kevin
Status: Not Started
Time Estimation: 6
Time Spent: 0
~~~~
~~~~
Feature Name: Yelp! 
Description: Be able to see Yelp reviews on the front end of restaurants 
Requires: Interaction with Yelp API, display on the front end
Developers:
Status: Not Started 
Time Estimation:
Time Spent: 0 Hours
~~~~

##### New Feature Template #####
~~~~
Feature Name: 
Description: 
Requires: 
Status:
Developers:
Time Estimation: # Hours
Time Spent: # Hours
~~~~

##### Feature Example #####
~~~~
Example from Alexey: Feature name: Where did you park your car? 
Description: A Google map in which one could locate where he/she parks the family car. 
Requires: Adding logic to the server, working with Google maps API, adding client side support.
Developers: Alexey
Status: Server side ready, other parts are missing. 
Time Estimation: 12 hours
Time Spent: 8 Hours
~~~~



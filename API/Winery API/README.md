*See api documentation for all notes and instructions on how to use API and Postman tests
Please note - This limited term project that is hosted on Google Cloud and may or may not be running if you try to access it (either from login URL or through Postman collection tests). Running it locally will require API keys which are private to the owner of this project (Patrick Stumbaugh).


This API was designed around the idea of creating a common database for winery owners to keep track of their wineries and the wines those wineries produce. A user must login with their credentials in order to access the information stored associated with their account. 

An owner may do any of the CRUD operations, including: Add wineries and wines (and be able to link the two together so that they may keep track of their inventory). Delete wines and wineries (which will delete the wines associated). Update or edit their entities. Get all or certain items in their database collection. This API also supports other functions, please see the API documentation for more information. 

Data Model:
This app stores entities in the Google Cloud Datastore: Wineries and Wines.
![wineries](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Web%20Design/ArtGallery/EXAMPLES%20AND%20DOCUMENTS/GALLERIES.png?raw=true)

![wines](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Web%20Design/ArtGallery/EXAMPLES%20AND%20DOCUMENTS/GALLERIES.png?raw=true)


The API is modeled in this way:
• A main user
• Wineries
o Every call to this winery must be made by the user that owns the winery (the
user that created it).
o If a wine (or wines) is associated with a specific winery, a “wines” section will
show which wines belong to this winery. • Wines
o Every call to a wine must be made by the user that owns the wine (the user that created it).
o Wines may be added or deleted from a winery. When a wine is part of a winery and a GET request is made to that wine, the API will return a “producer” section showing which winery owns the wine.
• Each call to an entity that requires an owner authentication will have to be supplied a Bearer token with the owner’s id_token (Postman collection handles this in test suite).
• This API does not have endpoints with user id’s.
o Only JWT’s (which are saved from id_token to postman environment variables
for testing) are needed.
• Every non-user entity endpoint is protected (wines and wineries).
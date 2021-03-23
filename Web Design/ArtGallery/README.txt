
Overview:

An art corporation sells paintings from multiple galleries and requires a database to keep track of sales records of paintings from galleries to customers, including customerID and orderID. The database will also keep track of paintings that exist in each gallery as well as if a gallery contains paintings of a specific artist. Database is recorded and updated after an order has been placed. Database will be able to accommodate 200 orders annually. Our galleries can hold approximately 400 pieces of art for sale and the database will be able to accommodate approximately the listing and record of 10 years of paintings acquired and sold by the gallery at 4000. The site consists of 7 pages, Home, Artists, Customers, Galleries, Paintings, Orders, Custom Search. Artists, Customers, Galleries, Paintings, Orders pages are used to display current tables for each respective entity and for inserting, updating and deleting from each entity. The custom search page can be used to lookup a specific entry using a user inputted search from a user selected table.


Notes:

This website requires a login to the Oregon State University VPN in order to view. In lieu of this, we have saved example pictures of different pages within the website. Please see the "EXAMPLES AND DOCUMENTS" folder to view these pictures. 

The database outline, schema and entity-relationship diagram are all located within the "EXAMPLES AND DOCUMENTS" folder. 


(if logged into the OSU VPN, and the database is still active:)
To run program:
    in ArtGalleryLive folder, type in:
    node art.js 
(this will start the website under the current port number. See terminal output for address)

To change the port number, change it in the following two locations:
    1) near the top of art.js where the variable "port" is declared.
    2) in the public folder, under the portNumber.js file. Change the "number" variable to the port you want




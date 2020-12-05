This is an example of a dynamic table to track your workouts. 
Please note, this table is not currently live. It does work, but an OSU 
login and MySQL account are needed. It is here as an example of linking frontend
development with backend. 

Frontend development is using HTML5, CSS and Javascript. Backend development
is using Node.js, Express and MySQL. (note - the node.js modules are not included
in this repository due to size. The username and password for the MySQL table 
is also hidden). 

The table works as follows:

The user can add a workout entry to the table. Using AJAX, it will automatically
populate the table with the information along with sending it to the MySQL database.
The user can add any number of entries.

There is a reset table button to clear out all the workouts (AJAX). 

For each workout, there is a unique update and delete button. The delete button 
will delete the entry from the table and the database (AJAX).

The update button will take you to a new page with just that workout entry. A form 
will be available to change any infor in that entry. Anything left blank will 
retain previous values. 

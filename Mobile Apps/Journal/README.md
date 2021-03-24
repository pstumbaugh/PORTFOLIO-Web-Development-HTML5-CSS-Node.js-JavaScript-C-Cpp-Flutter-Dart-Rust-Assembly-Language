# Journal

Displaying an entry's details:

![entry display](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/entry%20display.png?raw=true)


Displaying an entry's details:

![entry display](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/entry%20display.png?raw=true)


Displaying an entry's details:

![entry display](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/entry%20display.png?raw=true)


Displaying an entry's details:

![entry display](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/entry%20display.png?raw=true)


Displaying an entry's details:

![entry display](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/entry%20display.png?raw=true)


Original Prompt:

Implement a program that models a journal, enabling users to create journal entries, which have a title, body, date and rating. You could use this to log good and bad days, favorite coffee shops, beverages, anime episodes, pair-programming dates - you get the idea.

The program should enable a user to view existing journal entries in a list, view a single journal entry, and add a new journal entry. In addition, the program should enable a user to change the application theme from light to dark. The theme preferences and journal data should persist between application restarts. Lastly, the application should be adaptive, based on the amount of horizontal space available on the screen. The functional requirements are:

Display a "welcome" widget when the application starts and there are no journal entries.
Provide the user, via a button in the right of the AppBar, with a toggle-able configuration option, presented in a Drawer, to change the theme from light to dark.
Changing the configuration should immediately change the visual theme of the app.
The configuration preference should persist between application restarts, and be honored when the user starts the application.
When no prior saved preference exists, use the light theme.
When the application starts, load the saved theme configuration, and immediately use it when creating the MaterialApp.
Model a journal consisting of journal entries. A JournalEntry object has an id (an integer), title (a string), body (a string), rating (an integer), and date (a DateTime).
Display a list of existing journal entries, by displaying the title and date of the journal entry.
Display the details of the journal entry, including its title, body, date and numeric rating, when tapped on in the list.
Enable the user to go "back" to the list when viewing the details of a journal entry full-screen.
Adapt the interface to display the list of journal entries on the left, and the details of the entry on the right (in a "master-detail" layout convention) when the device has at least 800* pixels of horizontal space. (* If your simulator/device screen isn't large enough, just pick a width that makes sense, eg 500 or 700.)
Display a FloatingActionButton that, when tapped, displays a form for entering attributes of a new journal entry.
Validate the values in the form, ensuring that the title and body are not blank, and that the rating is an integer between 1 and 4.
Create a new journal entry when the form's "Save" button is tapped, and return to the previous screen
Ensure that new journal entries appear in the list after the form's "Save" button is tapped.
Ensure that previously-created journal entries appear in the list when the application first starts.
In addition to the functional requirements above, your application should meet the following technical requirements:

Do not use a state management library, such as provider or scoped_model. Rely on manual state management and/or APIs in the Flutter SDK.
Use the "shared preferences" concept of mobile applications to load and save the theme configuration option, so that the chosen option persists between application restarts.
Use a sqlite database file to store, retrieve and update the journal entries, so that the data persists between application restarts. Do not "pre-create" the database file - have your app code do it on the device. Name the database file journal.sqlite3.db.Use the following queries or create your own:
SELECT * FROM journal_entries;
INSERT INTO journal_entries(title, body, rating, date) VALUES(?, ?, ?, ?);
Do not hard-code the database schema as a String in your code. Use the "assets" or "file i/o" concept of mobile applications to load the text of the initial SQL statement that creates the schema of the sqlite database. Use this text file download .

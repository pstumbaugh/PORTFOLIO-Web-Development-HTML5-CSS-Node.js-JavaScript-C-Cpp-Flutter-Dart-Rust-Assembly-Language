# Wasteagram

Home Page (showing entries):

![home](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/home%20page%20of%20entries.png?raw=true)


Displaying an entry's details:

![entry display](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/entry%20display.png?raw=true)


Creating a new entry:

![new entry](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/new%20entry.png?raw=true)


Uploading image to database spinner:

![upload image](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps/Wasteagram/EXAMPLES/uploading%20picture%20spinner.png?raw=true)


Display horizontally:

![horizontal](https://github.com/pstumbaugh/PORTFOLIO-Web-Development-HTML5-CSS-Node.js-JavaScript-C-Cpp-Rust-Assembly-Language/blob/main/Mobile%20Apps%20(in%20progress)/Call%20Me%20Maybe/EXAMPLES/profile%20tab.png?raw=true)










Original Prompt:

Your client, Matthew Peter, is the owner of TwentySix Cafe, a Portland coffee shop.

"Man, I am so tired of these wasted bagels and pastries we have at the end of every day!" he says. "I'm losing money, and it's so wasteful... I feel like there's an episode of Portlandia about this. I mean, why waste a donut? A donut!"

Mr. Peter wants his employees to run an application that, "is like Instagram, but for food waste," he says. Every night the person closing the shop can gather up the leftover baked goods, take out their phone, start the app, and create a post consisting of a photo of the wasted food and the number of leftover items.

"If only I could see a list of these posts over time, then at least I'd know how much money I'm losing, and I could make adjustments to my pastry orders," he says, dreamily. "No more forsaken donuts!"

You have engaged Matthew Peter in a paid contract to develop a functioning version of the application that he and his employees can try out at the coffee shop. "Hey, I know," he says, "Let's call it Wasteagram."

Implement Wasteagram, a mobile app that enables coffee shop employees to document daily food waste in the form of "posts" consisting of a photo, number of leftover items, the current date, and the location of the device when the post is created. The application should also display a list of all previous posts.

The functional requirements are:

Display a circular progress indicator when there are no previous posts to display in the List Screen.
The List Screen should display a list of all previous posts, with the most recent at the top of the list.
Each post in the List Screen should be displayed as a date, representing the date the post was created, and a number, representing the total number of wasted items recorded in the post.
Tapping on a post in the List Screen should cause a Detail Screen to appear. The Detail Screen's back button should cause the List Screen to appear.
The Detail Screen should display the post's date, photo, number of wasted items, and the latitude and longitude that was recorded as part of the post.
The List Screen should display a large button at the center bottom area of the screen.
Tapping on the large button enables an employee to capture a photo, or select a photo from the device's photo gallery.
After taking a new photo or selecting a photo from the gallery, the New Post screen appears.
The New Post screen displays the photo of wasted food, a Number of Items text input field for entering the number of wasted items, and a large upload button for saving the post.
Tapping on the Number of Items text input field should cause the device to display its numeric keypad.
In the New Post screen, tapping the back button in the app bar should cause the List Screen to appear.
In the New Post screen, tapping the large upload button should cause the List Screen to appear, with the latest post now appearing at the top of the list.
In the New Post screen, if the Number of Items field is empty, tapping the upload button should cause a sensible error message to appear.

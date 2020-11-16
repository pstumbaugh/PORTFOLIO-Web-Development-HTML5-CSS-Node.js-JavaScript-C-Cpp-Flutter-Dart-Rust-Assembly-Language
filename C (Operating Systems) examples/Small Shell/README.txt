# smshell

This program will create a small shell for the user to enter commands on. Most commands will be executed by exec() type functions, except for "cd", "status", and "exit", along with expanding every instance of "$$" to the current working PID number. 

----------------------

To create the executable file:
In the same directory as "main.c", type: 
    gcc --std=gnu99 -o smallsh main.c
This will create the executable file named "smallsh"

To run the file, type "./smallsh" in the command line. This will start the small shell. You should see ": " as a command line prompt waiting for you to enter a command. 

----------------------

Ending a command with "&" will send it to the background. You will receive a note of what the background PID number is. 

A command line beginning with "#" will be treated as a comment, and nothing will happen.

As mentioned earlier, "$$" will be expanded to show what the current PID number is. 

You may use ">" and "<" as input and output redirection.

You are free to use most other built in commands within the shell. 

A CTRL-Z command from the keyboard sends a SIGTSTP signal to the parent shell process and all children at the same time.

A CTRL-C command from the keyboard sends a SIGINT signal to the parent process and all children at the same time.

*note: "|" piping is not supported.

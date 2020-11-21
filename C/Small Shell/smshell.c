//Patrick Stumbaugh

//create using:
    // gcc --std=gnu99 -o smallsh main.c
//then run using:
    // ./smallsh

#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <string.h>
#include <signal.h>
#include <stdbool.h>

//global variables
char* inputFile = NULL; //input file's name
char* outputFile = NULL; //output files's name
int status; //placeholder for exit status
int foregroundModeFlag = 0; //Flag for foreground only mode
int backgroundCounter = 0; //counter to keep track of background processes

// Signal actions
struct sigaction SIGINT_action = {0};
struct sigaction SIGTSTP_action = {0};

//function declarations
void runningLoop(char* homeDir);
void checkForProcesses(int* backgroundPIDs);
char* getInputLine();
char** parseInputLine(char *userInput, int* inputFlag, int* outputFlag, int* inputFileFlag, int* backgroundFlag);
void runCommands(char** parsed, int* inputFlag, int* outputFlag, char* homeDir, int* inputFileFlag, bool* continueRunning, int* backgroundFlag, int* backgroundPIDs);
void replaceWithPID(char *source, const char *searchFor, const char *replaceWith);
void addBgPID(int pidno, int* backgroundPIDs);
void removeBgPID(int pidno, int* backgroundPIDs);
void foregroundOnlyMode(int signo);
void freeMemPointer(char* file);
void freeMem2xPointer(char** file);


/*Main program will prompt user for a command. It will then parse the line
that the user entered into different tokens, store those in a seperate char
array, then execute those commands based on what is asked for. If a command
ends with "&" it will be sent to the background processes.
*/
int main (int argc, char* argv[]) 
{
	// get the home directory (from this program's environment variables)
    char* homeDir = getenv("HOME");
	
	//Initialize SITGINT
	SIGINT_action.sa_handler = SIG_IGN;
	sigaction(SIGINT, &SIGINT_action, NULL);

	//Initialize SIGTSTP (foreground-only)
	SIGTSTP_action.sa_handler = foregroundOnlyMode;
	sigfillset(&SIGTSTP_action.sa_mask);
	SIGTSTP_action.sa_flags = SA_RESTART;
	sigaction(SIGTSTP, &SIGTSTP_action, NULL);
	
	//Get input from user, do work, loop around until user enters "exit"
	//(this is the main workhorse of the program)
	runningLoop(homeDir);

	return 0;
}



/**************************************************************************
    FUNCTIONS
**************************************************************************/



//Main looping function - gets input from the user, parses that, checks for 
//running background processes, then executes commands. Loops until user
//enters "exit" command 
//INPUT: nothing 
//OUTPUT: nothing
void runningLoop(char* homeDir) 
{
	int inputFlag = 0; //flag if input file name is received (1 if true)
	int outputFlag = 0; //flag if output file name is received (1 if true)
	int inputFileFlag = 0; //flag if an input file is given (1 if true)
	bool continueRunning = true; //loop bool to continue running 
	char *userInput = NULL; //line to hold user's input
	char **parsed = NULL; //array to hold user's input parsed into seperate commands
	int backgroundFlag = 0; //background processes flag (1 if background process)
    int backgroundPIDs[100]; //storage array for background PID numbers

	
	while(continueRunning == true) 
	{
		int stdin_save = dup(STDIN_FILENO); // save stdin position
    	int stdout_save = dup(STDOUT_FILENO); // save stdout position

		// Check background processes
		if (backgroundCounter > 0) 
		{	
			checkForProcesses(backgroundPIDs);
		}
		
		// Handle input
		userInput = getInputLine();
		parsed = parseInputLine(userInput, &inputFlag, &outputFlag, &inputFileFlag, &backgroundFlag);
		runCommands(parsed, &inputFlag, &outputFlag, homeDir, &inputFileFlag, &continueRunning, &backgroundFlag, backgroundPIDs);
		
		
		//free memory stored from last command line input
		freeMemPointer(userInput); //also frees inputFile if made
		freeMem2xPointer(parsed);

        //reset input and output file names and flags
		inputFile = NULL;
		outputFile = NULL;
		userInput = NULL;
		parsed = NULL;
	    outputFlag = 0;
	    inputFlag = 0;
	    inputFileFlag = 0;
	    
    	dup2(stdout_save, STDOUT_FILENO); // restore standard out
        dup2(stdin_save, STDIN_FILENO); // restore standard in 
	}
}



//Function to check if there are any background processes that have 
//finished running. If so, print that they have finished
//INPUT: nothing
//OUTPUT: nothing
void checkForProcesses(int* backgroundPIDs) 
{
	// Check to see if a background process terminated
	pid_t bgPIDrunning;
	//see if any background processes are finished (if true, bgPIDrunning > 0)
	bgPIDrunning = waitpid(-1, &status, WNOHANG); 
	
	while (bgPIDrunning > 0) //if > 0, there is a background process done running
	{
		// If so, remove it from the array
		removeBgPID(bgPIDrunning, &*backgroundPIDs);
		
		// if it exited normally, print status
		if (WIFEXITED(status)) 
		{
			printf("background pid %d is done. exit value %d\n", bgPIDrunning, WEXITSTATUS(status)); 
			fflush(stdout);
		} 
		else if (WIFSIGNALED(status)) //if exited by signal, print signal 
		{
			printf("background pid %d is done. terminated by signal %d\n", bgPIDrunning, WTERMSIG(status)); 
			fflush(stdout);	
		}
		
		// Recheck background processes finished. If more, loop
		bgPIDrunning = waitpid(-1, &status, WNOHANG);
	}	
}



/*Prompt and get a command line from the user. 
Check if that line has "$$" in it. 
If it does, repalce it with the PID number currently being run */
//INPUT: nothing
//OUTPUT: string for the line of commands from user
char* getInputLine() 
{
	// Prompt the user for a new line of commands
	printf(": ");
	fflush(stdout);
	
	// Save the user's input into a char pointer "userInput"
	char *userInput = NULL;
	size_t bufsize = 0;
	getline(&userInput, &bufsize, stdin);
	
	//check if we need to replace any "$$" with PID number
	char *pidCheck = strstr(userInput, "$$");
	if (pidCheck != NULL) 
	{
		char alteredString[50];
		sprintf(alteredString, "%d", getpid());
		replaceWithPID(userInput, "$$", alteredString);
	}
	return userInput;
}



//Iterates through user's input line of commands, parses those commands into 
//seperate char pointers, stores in parsed array for later use (with exec...)
//INPUT char* userInput 
//OUTPUT parsed array
char** parseInputLine(char *userInput, int* inputFlag, int* outputFlag, int* inputFileFlag, int* backgroundFlag) 
{
	//allocate memory for parsed array
	char **parsed = malloc(100 * sizeof(char*)); 
	
	char *token; 
	char *prevToken = NULL;
	int position = 0;
	char* delim = " \t\r\n\a"; //used to seperate tokens
	
	// seperate userInput string into tokens
	token = strtok(userInput, delim);
		
	while (token != NULL) {
		
		// Output redirection
		if (strcmp(token, ">") == 0) {
			*outputFlag = 1;
			
			int input_fd = open(parsed[position-1], O_RDONLY);
			if (input_fd != -1) //error, assume there's a file it found 
			{
			    *inputFileFlag = 1;
			    inputFile = prevToken;
			}
			
			outputFile = strtok(NULL, delim);
			
			token = strtok(NULL, delim);
			parsed[position] = NULL;
			position++;
			continue;
		}
		
		// Input redirection
		if (strcmp(token, "<") == 0) {
			*inputFlag = 1;
			
			inputFile = strtok(NULL, delim);
			token = strtok(NULL, delim);
			parsed[position] = NULL;
			position++;
			continue;
		}
		
		// Background process
		if (strcmp(token, "&") == 0) {
			parsed[position] = NULL;
			if (foregroundModeFlag) 
			{
				*backgroundFlag = 0;
			} else 
			{
				*backgroundFlag = 1;
			}
			break;
		}			
		
		// Add to arguments
		parsed[position] = token; 
		position++;
		prevToken = token;
		token = strtok(NULL, delim);
	}
	
	// Set last argument to NULL
	parsed[position] = NULL;
	return parsed;
}



//Executes commands (first checks for built in commands, if not matching,
//send to launch to execute shell commands)
//INPUT: char **parsed, int* inputFlag, int* outputFlag, char* homeDir
//OUTPUT: nothing
void runCommands(char** parsed, int* inputFlag, int* outputFlag, char* homeDir, int* inputFileFlag, bool* continueRunning, int* backgroundFlag, int* backgroundPIDs)
{
    //variables to save PID numbers
    pid_t spawnPid;
	pid_t waitPid;
	
    //If it's a blank line or comment
	if (parsed[0] == NULL) //if blank line, don't do anything
	{
	    return;
	} 
	else if (strcmp(parsed[0], "#") == 0) //if line starts with #, don't do anything (comment line)
	{
	    return;
	}
	else if (strcmp(parsed[0], "exit") == 0) //check for exit command
	{
		while (backgroundCounter > 0) 
		{
			kill(backgroundPIDs[0],SIGTERM); //kill background process (if true) (using SIGTERM)
			removeBgPID(backgroundPIDs[0], backgroundPIDs); //remove background process kill from count / array
		}
		*continueRunning = false; //switch to false to exit runningLoop() and return to main
		
	} 
	else if (strcmp(parsed[0], "cd") == 0) //check for change directory command
	{
		//if no directory listed, change to home directory (homeDir)
		if (parsed[1] == NULL) 
		{
			if(chdir(homeDir) != 0) 
			{
				perror("chdir error"); //if error, print
				fflush(stdout);
			}
		} 
		else //change to directory listed by user 
		{
			if(chdir(parsed[1]) != 0) //if user directory not found...
			{
				perror("chdir error");//...print error
				fflush(stdout);
			}
		}	
	} 
	else if (strcmp(parsed[0], "status") == 0) //if status call, show last exit status
	{	
		if (WIFEXITED(status)) //check if last exited normally
		{
			printf("exit value %d\n", WEXITSTATUS(status));
			fflush(stdout);
		} 
		else if (WIFSIGNALED(status)) //else, check if exited by terminating signal
		{
			printf("terminated by signal %d\n", WTERMSIG(status));
			fflush(stdout);	
		}
	} 
	else //run exec... depending on what command is given
	{
    	spawnPid = fork(); //fork child
    	
    	switch(spawnPid)
    	{
        	case -1: //fork didn't work, exit
        	{
        		perror("fork");
        		fflush(stdout);
        		exit(1);
        	}
        	case 0: //fork worked, child process running this
        	{
        		fflush(stdout);
        
        		// Set input if specified
        		if (*inputFlag) //if there is an input file, open and read it
        		{
        			int fd0 = open(inputFile, O_RDONLY); //open input file read only
        			if (fd0 == -1) //if error opening input file, display error
        			{
        				printf("cannot open %s for input\n", inputFile);
        				fflush(stdout);
        				exit(1);
        			} 
        			else 
        			{
        				if (dup2(fd0, STDIN_FILENO) == -1)  //redirect stdin to input file descriptor
        				{
        					perror("dup2");
        					fflush(stdout);
        				}
        				close(fd0);	
        			}
        		}
        
        		if (*outputFlag) //if redirecting to output file
        		{
        		    //open output file, create if new, append if already there. Read / write permissions
        		    int fd1 = open(outputFile, O_WRONLY | O_CREAT | O_APPEND, 0600);
        			if (fd1 == -1) //if error creating output file, display error
        			{
        				printf("cannot create %s for output\n", outputFile);
        				fflush(stdout);
        				exit(1);			
        			} 
        			else //
        			{
        				if (dup2(fd1, STDOUT_FILENO) == -1) //redirect stout to output file descriptor
        				{
        					perror("dup2");
        					fflush(stdout);
        				}
        				close(fd1);	
        			}
        		}
        		
        		
        		if (*backgroundFlag) // if working in background
        		{
        		    //set input and output to /dev/null for input/output in background
        			if (!*inputFlag) //if no input file specified
        			{
        				int bgFDinput = open("/dev/null", O_RDONLY); //open read only
        				if (bgFDinput == -1) {
        					printf("cannot open for input\n");
        					fflush(stdout);
        					exit(1);
        				} 
        				else 
        				{
        					if (dup2(bgFDinput, STDIN_FILENO) == -1) 
        					{
        						perror("dup2");
        					}
        					close(bgFDinput); //close file	
        				}	
        			}
        			
        			// Set output to dev/null if not specified
        			if (!*outputFlag) 
        			{
        				int bgFDoutput = creat("/dev/null", 0600); //create for ready/write
        				if (bgFDoutput == -1) 
        				{
        					printf("cannot set output\n");
        					fflush(stdout);
        					exit(1);			
        				} 
        				else 
        				{
        					if (dup2(bgFDoutput, STDOUT_FILENO) == -1) 
        					{
        						perror("dup2");
        						fflush(stdout);
        					}
        					close(bgFDoutput);	
        				}
        			}	
        		}
    
        		// set SIGINT to foreground
        		if (!*backgroundFlag) 
        		{
        			SIGINT_action.sa_handler = SIG_DFL;
        			SIGINT_action.sa_flags = 0;
        			sigaction(SIGINT, &SIGINT_action, NULL);
        		}
        		
        		//execute commands (first check if using file for redirection)
        		if (*inputFileFlag == 1) //if an input file is found (using redirect with file)
        		{
        		    if(execlp("cat", outputFile, inputFile, NULL) == -1)
                    {
                        perror("Error executing command.");
                        fflush(stdout);
                    }
                    *inputFileFlag = 0; //reset inputFileFlag to 0
        		}
        		
        		// execute all other commands
        		else if (execvp(parsed[0], parsed)) 
        		{
        			perror(parsed[0]);
        			fflush(stdout);
        			exit(1);		
        		}
        	
        	} 
        	
        	default: //parent process
        	{
        		if (!*backgroundFlag) //if not in background
        		{
        			do 
        			{
        			    //wait for any foreground processes to finish running (child process)
        				waitPid = waitpid(spawnPid, &status, WUNTRACED); 
        
        				if (waitPid == -1) //if error waiting, display error
        				{ 
        					perror("waitpid"); 
        					fflush(stdout);
        					exit(1); 
        				}
        				
        				if (WIFSIGNALED(status)) //if process terminated by signal, display results
        				{
        					printf("terminated by signal %d\n", WTERMSIG(status));
        					fflush(stdout);
        				}
        				
        				if (WIFSTOPPED(status))  //if stopped by signal, display results
        				{
        					printf("stopped by signal %d\n", WSTOPSIG(status));
        					fflush(stdout);
        				}
        
        			} 
        			while (!WIFEXITED(status) && !WIFSIGNALED(status)); //while still running processes
        	
        		} 
        		else //background mode on
        		{
        			printf("background pid is %d\n", spawnPid); //display background PID #
        			fflush(stdout); 
        			addBgPID(spawnPid, backgroundPIDs); //add background PID to array storing running bg processes
        			*backgroundFlag = 0; // reset to point to foreground
        		}
        	}
    	}
	}
    return;
}



//Replaces "$$" with pid in the source string 
//parts borrowed from stackoverflow.com
//INPUT: char *source, const char *searchFor, const char *replaceWith
//OUTPUT: nothing
void replaceWithPID(char *source, const char *searchFor, const char *replaceWith) 
{
	char buffer[2048] = {0}; //holding buffer
    char *insertPos = &buffer[0]; //starting insert point into buffer
    const char *tempArray = source; //temp char pointer
    size_t lenSearchFor = strlen(searchFor); //for this program, this is "$$"
    size_t lenReplaceWith = strlen(replaceWith); //PID # to replace "$$"
	
    while (1) //loop until it finds the item to replace (repeat until no more $$)
    {
		// See if our array has any "$$" in it
        const char *result = strstr(tempArray, searchFor);
        
		// No more "$$" found, copy over and exit function 
        if (result == NULL) 
        {
            strcpy(insertPos, tempArray); //copy our new string over the original
            break;
        }

        // Copy first part of string into a holding spot
        memcpy(insertPos, tempArray, result - tempArray);
        insertPos += result - tempArray;

        // Copy the PID into the "$$" position
        memcpy(insertPos, replaceWith, lenReplaceWith);
        insertPos += lenReplaceWith;

        // move the pointer up (new result + size of the PID we repalced "$$" with)
        tempArray = result + lenSearchFor;
    }

    // Copy the new string (buffer) back over the original string
    strcpy(source, buffer);
}



 //If background process called, add it's process number to the bg array tracker
 //INPUT: int pidno
 //OUTPUT: nothing
void addBgPID(int pidno, int* backgroundPIDs) 
{
	
    backgroundPIDs[backgroundCounter] = pidno;
	backgroundCounter++;	
}



//If a background process completes / exits, remove it from our background 
//array tracker
//INPUT: int pidno
//OUTPUT: nothing
void removeBgPID(int pidno, int* backgroundPIDs) 
{
    //loop through background array (backgroundPIDs[]) until it finds the pid number
    //that is needing to be removed
    for (int i = 0; i < backgroundCounter; i++) 
    {
		if (backgroundPIDs[i] == pidno) //pid number found, remove it
		{
			while (i < backgroundCounter - 1) //move array items over one position
			{
				backgroundPIDs[i] = backgroundPIDs[i + 1];
				i++;
			}
			backgroundCounter--; //remove 1 from background processes counter
			break;
		}
    }
    return;
}



//Enters or exits foreground-only mode depending on SIGTSTP
//INPUT: int signo 
//OUTPUT: nothing
void foregroundOnlyMode(int signo) 
{
	//enter the foreground-only mode
	if (foregroundModeFlag == 0) 
	{	
		char *message = "\nEntering foreground-only mode (& is now ignored)\n";
		write(STDOUT_FILENO, message, 50);
		foregroundModeFlag = 1;
	} 
	else //exit the foreground-only mode
	{
		char *message = "\nExiting foreground-only mode\n";
		write(STDOUT_FILENO, message, 30);
		foregroundModeFlag = 0; 
	}
	
	//writes prompt to the console
	char *prompt = ": "; 
	write(STDOUT_FILENO, prompt, 2); 
	fflush(stdout);
}



//free memory from a single char pointer 
//INPUT: char* file
//OUTPUT: nothing
void freeMemPointer(char* file)
{
    if (file != NULL)
    {
        free(file);
        file = NULL;
    }
    return;
}



//free memory from a double pointer char
//INPUT: char** file
//OUTPUT: nothing
void freeMem2xPointer(char**file)
{
    if (file != NULL)
    {
        free(file);
    }
    file = NULL;
    return;
}


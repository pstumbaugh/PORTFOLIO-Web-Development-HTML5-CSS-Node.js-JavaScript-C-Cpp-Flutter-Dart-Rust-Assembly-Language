/*
Patrick Stumbaugh
*/

#include <sys/stat.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <pthread.h>


#define MAXLINESIZE 1000

//GLOBAL VARIABLES
//Initialize the mutex's for the buffers
pthread_mutex_t mutex_1 = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t mutex_2 = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t mutex_3 = PTHREAD_MUTEX_INITIALIZER;
// Buffers for shared resources
char* buffer_1[MAXLINESIZE];
char* buffer_2[MAXLINESIZE];
char* buffer_3[MAXLINESIZE];
// Index where the producer thread will put the next item
int prod_idx_1 = 0;
int prod_idx_2 = 0;
int prod_idx_3 = 0;
// Index where the consumer thread will consume the next item
int con_idx_1 = 0;
int con_idx_2 = 0;
int con_idx_3 = 0;
// Number of items in the buffer
int count_1 = 0;
int count_2 = 0;
int count_3 = 0;
// Initialize the condition variable for each buffer
pthread_cond_t full_1 = PTHREAD_COND_INITIALIZER;
pthread_cond_t full_2 = PTHREAD_COND_INITIALIZER;
pthread_cond_t full_3 = PTHREAD_COND_INITIALIZER;


//FUNCTION DECLARATIONS (in order of typical execution)
void* inputData(void* args);
void produceBuffer1(char* item);
void* lineSeperator(void* args);
char* consumeBuffer1();
void produceBuffer2(char* item);
void* plusSignConversion(void *args);
char* consumeBuffer2();
void produceBuffer3(char* item);
void* writeToOutput(void *args);
char* consumeBuffer3();
bool checkForStopPreLineSeperator(char* searchString);
bool checkForStopPostLineSeperator(char* searchString);

//global variable to hold the fragment of a string not used after printing
char* remainingFragment;

int main(int argc, char **argv)
{
    //create max size for variable
    remainingFragment = (char*) malloc(MAXLINESIZE); 

    //create pthread_t variables for each thread
    pthread_t input_t, lineSeperator_t, plusSignConversion_t, output_t;
    
    //Create the threads
    pthread_create(&input_t, NULL, inputData, NULL);
    pthread_create(&lineSeperator_t, NULL, lineSeperator, NULL);
    pthread_create(&plusSignConversion_t, NULL, plusSignConversion, NULL);
    pthread_create(&output_t, NULL, writeToOutput, NULL);

    //Join the threads
    pthread_join(input_t, NULL);
    pthread_join(lineSeperator_t, NULL);
    pthread_join(plusSignConversion_t, NULL);
    pthread_join(output_t, NULL);
    
    //free malloc'd variable
    free(remainingFragment);
    
    return EXIT_SUCCESS;
}



/*
Inputs data from the user. If no command line given, it will input from 
the console as stdin. If a text file is given, it will input from that text
file. Either way, once it hits the word "STOP" on it's own line, followed by
a new line character, it will stop reading data and return

INPUT: nothing (void *args)
OUTPUT: NULL 
*/
void *inputData(void *args)
{
    int bytes_read;
    size_t size = 1000; //1000 is max size of string
    int stringLinePosition = 0;
    
    for (int inputDataCounter = 0; inputDataCounter <= 50; inputDataCounter++)
    {
        //check if the next char is the EOF (returns as -1 if true)
        //for stdin from a file
        char c = getc(stdin);
        if (c == -1) //if EOF, break loop
            break;
        else //put char back into stdin
            ungetc(c, stdin);

        char* myTestString = (char*) malloc(MAXLINESIZE); 
        
        //get the line of input. Save it in strings[position]
        bytes_read = getline (&myTestString, &size, stdin); 
        
        //if error reading string
        if (bytes_read == -1) 
        {
            perror ("Error reading input");
            exit(1);
        }
        
        //if STOP is encountered, send current string and stop reading input
        if (checkForStopPreLineSeperator(myTestString) == true)
        {
            produceBuffer1(myTestString);
            break;
        }
        else
        {
            //put the item into the buffer for line separator thread
            produceBuffer1(myTestString); 
        }
        
        //Increment the saving position
        stringLinePosition++;
    }

    return NULL;
}



/*
Function will take item and store it in a buffer position. While storing, it 
will lock the mutex so nothing else can access it during that time. 
Once stored, it will unlock the mutex. 

INPUT: char* item 
OUTPUT: nothing
*/
void produceBuffer1(char* item)
{
  // Lock the mutex before putting the item in the buffer
  pthread_mutex_lock(&mutex_1);
  // Put the item in the buffer
  buffer_1[prod_idx_1] = item;
  // Increment the index where the next item will be put.
  prod_idx_1 = prod_idx_1 + 1;
  count_1++;
  // Signal to the consumer that the buffer is no longer empty
  pthread_cond_signal(&full_1);
  // Unlock the mutex
  pthread_mutex_unlock(&mutex_1);
  return;
}



/*
Thread 2, called the Line Separator Thread, replaces every new line char in 
the input by a space.

INPUT: nothing (void *args)
OUTPUT: NULL
*/
void *lineSeperator(void *args)
{
    size_t size = 1000; //1000 is max size of string

    //loop through each line given as input until a STOP is found
    for (int lineSeperatorCounter = 0; lineSeperatorCounter <= 50; lineSeperatorCounter++)
    {
        //get the string from buffer 1
        char* item = consumeBuffer1();
        char* token;
        char* delimiter = "\n";
        char* returningString;
        
        //create max size for new string 
        returningString = (char *) malloc (size); 
        
        //Initialize returningString to null
        for (int returningStringCounter = 0; returningStringCounter < 1000; returningStringCounter++)
            returningString[returningStringCounter] = '\0';
        
        // get the first token up through the new line character 
        //replace the new line character with a " ". 
        //Continue until no more new line characters found
        token = strtok(item, delimiter);
        while(token != NULL) 
        {
            //add the token to our returning string
            strcat(returningString, token);
            //add a space to the end of the returningString
            strcat(returningString, " ");
            //get the next line
            token = strtok(NULL, delimiter);
        }
        free(item);
        //item = '\0';
        
        //send the returningString to the second buffer
        produceBuffer2(returningString); 
    
        //check for a STOP. If found break from loop and return
        if (checkForStopPostLineSeperator(returningString) == true)
            break;
    }

    return NULL;
}



/*
Function will pull from a specified buffer storage spot. It will wait until 
there is an item ready to be pulled. During that time, it will lock the 
associated mutex. Once the item is found and work is done, it will unlock and 
return the item. 

INPUT: nothing
OUTPUT: char* item
*/
char* consumeBuffer1()
{
    // Lock the mutex before checking if the buffer has data
    pthread_mutex_lock(&mutex_1);
    
    //Loop (wait) until an item is ready to be consumed from the buffer
    while (count_1 == 0)
    {
        pthread_cond_wait(&full_1, &mutex_1);
    }
    
    //get the item from the buffer
    char* item = buffer_1[con_idx_1];
    
    // Increment the index from which the item will be picked up
    con_idx_1 = con_idx_1 + 1;
    count_1--; //decreate the count for the buffer
    
    // Unlock the mutex
    pthread_mutex_unlock(&mutex_1);
    
    // Return the item
    return item;
}



/*
Function will take item and store it in a buffer position. While storing, it 
will lock the mutex so nothing else can access it during that time. 
Once stored, it will unlock the mutex. 

INPUT: char* item 
OUTPUT: nothing
*/
void produceBuffer2(char* item)
{
    // Lock the mutex before putting the item in the buffer
    pthread_mutex_lock(&mutex_2);
    // Put the item in the buffer
    buffer_2[prod_idx_2] = item;
    // Increment the index where the next item will be put.
    prod_idx_2 = prod_idx_2 + 1;
    count_2++;
    // Signal to the consumer that the buffer is no longer empty
    pthread_cond_signal(&full_2);
    // Unlock the mutex
    pthread_mutex_unlock(&mutex_2);
    return;
}



/*
Gets input from buffer 2 (a char*) and checks to see if there are any "++"
within the string. It replaces any with "^" until none are left. That new 
string is then sent to buffer 3.

INPUT: nothing
OUTPUT: nothing (new string after replacement) 
*/
void *plusSignConversion(void *args)
{
    //Loop until a STOP is found (or 50 lines is reached)
    for(int plusSignCounter = 0; plusSignCounter <= 50; plusSignCounter++)
    {
        // Get the string from buffer 2
        char* originalString = consumeBuffer2();
        
        char* searchFor = "++"; //char string to replace
        char* replaceWith = "^"; //replacing it with
    	char tempReplaceBuffer[2048] = {0}; //holding buffer
        char *insertPosString = &tempReplaceBuffer[0]; //starting insert point into buffer
        const char *tempArray = originalString; //temp char pointer
        size_t lenSearchFor = strlen(searchFor);
        size_t lenReplaceWith = strlen(replaceWith); 
    	
    	//loop until it finds the item to replace. 
    	//If nothing, it breaks out of loop
        while (1) 
        {
    		// Check if our string has any "++" in it (returns NULL if no)
            const char *result = strstr(tempArray, searchFor);
            
            if (result == NULL) //if nothing, break from loop
            {
                //copy the rest of our string over
                strcpy(insertPosString, tempArray); 
                break;
            }
    
            // Copy first part of string into a holding spot
            memcpy(insertPosString, tempArray, result - tempArray);
            insertPosString += result - tempArray;
    
            // Copy "^" into the "++" position
            memcpy(insertPosString, replaceWith, lenReplaceWith);
            insertPosString += lenReplaceWith;
    
            // move the pointer up 
            //(new result + size of the "^" we repalced "++" with)
            tempArray = result + lenSearchFor;
        }
    
        // Copy the new string (tempReplaceBuffer) back over the original string
        strcpy(originalString, tempReplaceBuffer);
        
        //put the item into the buffer for output thread
        produceBuffer3(originalString); 
        
        //If a STOP is found, return null. Else continue on
        if (checkForStopPostLineSeperator(originalString) == true)
            break;
    }
    return NULL;
}



/*
Function will pull from a specified buffer storage spot. It will wait until 
there is an item ready to be pulled. During that time, it will lock the 
associated mutex. Once the item is found and work is done, it will unlock and 
return the item. 

INPUT: nothing
OUTPUT: char* item
*/
char* consumeBuffer2()
{
    // Lock the mutex before checking if the buffer has data
    pthread_mutex_lock(&mutex_2);
    
    //Loop (wait) until an item is ready to be consumed from the buffer
    while (count_2 == 0)
    {
        pthread_cond_wait(&full_2, &mutex_2);
    }
    
    //get the item from the buffer
    char* item = buffer_2[con_idx_2];
    
    // Increment the index from which the item will be picked up
    con_idx_2 = con_idx_2 + 1;
    count_2--; //decreate the count for the buffer
    
    // Unlock the mutex
    pthread_mutex_unlock(&mutex_2);
    
    // Return the item
    return item;
}



/*
Function will take item and store it in a buffer position. While storing, it 
will lock the mutex so nothing else can access it during that time. 
Once stored, it will unlock the mutex. 

INPUT: char* item 
OUTPUT: nothing
*/
void produceBuffer3(char* item)
{
    // Lock the mutex before putting the item in the buffer
    pthread_mutex_lock(&mutex_3);
    // Put the item in the buffer
    buffer_3[prod_idx_3] = item;
    // Increment the index where the next item will be put.
    prod_idx_3 = prod_idx_3 + 1;
    count_3++;
    // Signal to the consumer that the buffer is no longer empty
    pthread_cond_signal(&full_3);
    // Unlock the mutex
    pthread_mutex_unlock(&mutex_3);

    return;
}



/*
Function writes the processed data to standard output as lines of 
exactly 80 characters. As soon as 80 characters are produced, the output 
function will print that line. As in, it does not wait for all the input to be 
finished before printing.  

INPUT: nothing (void *args)
OUTPUT: null
*/
void *writeToOutput(void *args)
{
    bool toStop = false; //flag to signal stop function and return
    int size = 1000;
    
    //Loop until a STOP is found or 50 lines are consumed
    for (int outputCounter = 0; outputCounter <= 50; outputCounter++)
    {
        char* newString;
        newString = (char *) malloc (size); //malloc size for newString
        
        //Get the item from the buffer
        char* originalString = consumeBuffer3();
    
        //Check if the item is, by itself, a STOP
        if (checkForStopPostLineSeperator(originalString) == true)
        {
            free(newString);
            free(originalString);
            break;
        }
    
        //Initialize newString to null
        for (int newStringInitializeCounter = 0; newStringInitializeCounter < 1000; newStringInitializeCounter++)
            newString[newStringInitializeCounter] = '\0';
            
        //append the original string to whatever is remaining 
        //from the last string 
        strcat(remainingFragment, originalString);
        
        //append the remaining string (changed above) into the newString position
        strcat(newString, remainingFragment);
    
        //clear out the remaining string, readying for next remaining chars
        for (int clearCounter = 0; remainingFragment[clearCounter] != '\0'; clearCounter++)
        {
            remainingFragment[clearCounter] = '\0';
        }
        
        //get string size of current string
        size_t newStringSize = strlen(newString);
        
        //temp holder for each 80 piece line
        char** fragments;
        fragments = malloc(sizeof(*fragments) * newStringSize / 80);
    
        //loop for every 80 characters. Print line if 80 characters is reached
        for (int loopCounter = 0; loopCounter < (newStringSize / 80); loopCounter++)
        {
            //add 80 characters to the fragment
            fragments[loopCounter] = strndup(newString + 80 * loopCounter, 80);
            
            //check if this fragment has to STOP command, if so, exit loop
            if (checkForStopPostLineSeperator(fragments[loopCounter]) == true)//a STOP is found
            {
                free(fragments[loopCounter]);
                toStop = true;
                break;
            }
            
            //print the 80 character fragmented line 
            printf("%s", fragments[loopCounter]); 
            free(fragments[loopCounter]);
            //print a new line
            printf("\n"); 
        }

        //save the remainder of the string (if any)
        int remainingStringSizeVar = newStringSize % 80;
        //save a loop counter condition the same size as the remaining string size
        int remainingStringSizeLoopCond = remainingStringSizeVar;

        //add each leftover char in our string to remainingFragment cstring
        for (int remainingLoopCounter = 0; remainingLoopCounter < remainingStringSizeLoopCond; remainingLoopCounter++)
        {
            remainingFragment[remainingLoopCounter] = newString[newStringSize - remainingStringSizeVar];
            remainingStringSizeVar--;
        }
        
        //check if a STOP is encountered
        if (checkForStopPostLineSeperator(remainingFragment) == true)
            toStop = true;

        free(originalString);

        //if a STOP was ever encounted, break from loop and return
        if (toStop == true)
        {
            free(newString);
            break;
        }
    }
    return NULL;
}



/*
Function will pull from a specified buffer storage spot. It will wait until 
there is an item ready to be pulled. During that time, it will lock the 
associated mutex. Once the item is found and work is done, it will unlock and 
return the item. 

INPUT: nothing
OUTPUT: char* item
*/
char* consumeBuffer3()
{
    // Lock the mutex before checking if the buffer has data
    pthread_mutex_lock(&mutex_3);
    
    //Loop (wait) until an item is ready to be consumed from the buffer
    while (count_3 == 0)
    {
        pthread_cond_wait(&full_3, &mutex_3);
    }
    
    //get the item from the buffer
    char* item = buffer_3[con_idx_3];
    
    // Increment the index from which the item will be picked up
    con_idx_3 = con_idx_3 + 1;
    count_3--; //decreate the count for the buffer
    
    // Unlock the mutex
    pthread_mutex_unlock(&mutex_3);
    
    // Return the item
    return item;
}



/*
Checks to see if "STOP\n" is located within a specific string.
STOP must be on it's own line, followed immediately by a newline character

INPUT: char* string 
OUTPUT: true if STOP is found, false if STOP not found
*/
bool checkForStopPreLineSeperator(char* searchString)
{
    
    if (searchString[0] != 'S' || searchString[1] != 'T' || searchString[2] != 'O' || searchString[3] != 'P' || searchString[4] != '\n')
        return false;
    else
        return true;
    

}



/*
Checks to see if "STOP " is located within a specific string.
STOP must be on it's own line
*NOTE - the newline character at this point has been changed to space char
(as opposed to checkForStopPreLineSeperator())

INPUT: char* string 
OUTPUT: true if STOP is found, false if STOP not found
*/

bool checkForStopPostLineSeperator(char* searchString)
{
    if (searchString[0] != 'S' || searchString[1] != 'T' || searchString[2] != 'O' || searchString[3] != 'P' || searchString[4] != ' ')
        return false;
    else
        return true;
    
}



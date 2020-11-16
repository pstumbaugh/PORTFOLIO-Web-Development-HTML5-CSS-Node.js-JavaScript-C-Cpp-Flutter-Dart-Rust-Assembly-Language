//HASH TABLE

#include "app.h"
using namespace std;

int main()
{
//local variables
    int const MAX = 1000; //constant
    Table Finance;
    char fileName[] = "data.txt";
    char newReview[MAX];
    int newRating = 0;
    int userNumber = 0;
    int optionNum = 0;

//load our websites into Finance table 
    Finance.loadFromFile(fileName);
    
    cout << "Welcome back to your saved websites table. " << endl;
    
    while (optionNum != 6)
    {
        optionNum = 0; //reset optionNum
        while (optionNum < 1 || optionNum > 6)
        {
            cout << "Please choose from the following options: " << endl;
            cout << "1. Display all websites and information." << endl;
            cout << "2. Add a new website." << endl;
            cout << "3. Retrieve all websites for a specific topic." << endl;
            cout << "4. Edit your review and rating for a specific website." << endl;
            cout << "5. Remove all websites with a 1 rating." << endl;
            cout << "6. Exit the program." << endl;
            
            cin >> optionNum;
            cin.ignore(MAX, '\n');
            
            if (optionNum < 1 || optionNum > 6)
                cout << "Option not available, please try again" << endl;
        }
        
        if (optionNum == 1) //DISPLAY ALL WEBSITES 
            cout << Finance << endl;
            
        if (optionNum == 2) //ADD A WEBSITE
        {
            SavedWebsites parm;
            char topic[MAX];
            char website[MAX];
            char summary[MAX];
            char review[MAX];
            int rating;
            cout << "Add a website:" << endl;
            cout << "Enter Topic: ";
            cin.getline(topic, MAX, '\n');
            cout << "Enter Website Address: ";
            cin.getline(website, MAX, '\n');
            cout << "Enter Summary: ";
            cin.getline(summary, MAX, '\n');
            cout << "Enter Review: ";
            cin.getline(review, MAX, '\n');
            cout << "Enter Rating: ";
            cin >> rating; 
            cin.ignore(MAX, '\n');
            parm.setTopic(topic);
            parm.setWebsite(website);
            parm.setSummary(summary);
            parm.setReview(review);
            parm.setRating(rating);
            Finance.add(parm);
            cout << "WEBSITE INFORMATION ADDED TO SAVED TABLE" << endl << endl;
        }
        
        if (optionNum == 3) //RETRIEVE WEBSITES BASED ON TOPIC
        {
            char topic_keyword [MAX];

            cout << "Retrieve website addresses with topic keyword" << endl;
            cout << "Enter a topic keyword: ";
            cin.getline(topic_keyword, MAX, '\n');
            
        //displays all websites (just web address) of any matching topic keyword searches
            if (Finance.retrieve(topic_keyword, Finance) == false) //if found something, will display websites found
                cout << "**No matches found**" << endl << endl;
            else
                cout << endl;
        }
        
        if (optionNum == 4) //EDIT REVIEW AND RATING
        {
            //reset varibles
            newRating = 0;
            userNumber = 0;
        
            if (Finance.getSize() == 0)//nothing to edit
                cout << "**Nothing in your table to edit**" << endl;
            else
            {
                cout << endl << "Which item would you like to edit (choose number of the item)" << endl;
                Finance.displayWithNumbers(Finance);
        
                while (userNumber < 1 || userNumber > Finance.getSize())
                {
            //get item number to edit
                    cout << "Enter here: ";
                    cin >> userNumber;
                    cin.ignore(MAX, '\n');
                    cout << endl;
                    if (userNumber < 1 || userNumber > Finance.getSize())
                        cout << "Website at " << userNumber << " does not exist, please try again" << endl;
                }
    
            //display website user is editing
                cout << "You are now editing the following " << endl;
                Finance.youAreEditing(Finance, userNumber);
                cout << endl;
            
            //prompt for new review and rating
                cout << "What is your new review? ";
                cin.getline(newReview, MAX, '\n');
                while (newRating < 1 || newRating > 5) //checks bounds of rating
                {
                    cout << "What is your new rating? ";
                    cin >> newRating; 
                    cin.ignore(MAX, '\n');
                    if (newRating < 1 || newRating > 5)
                        cout << "ERROR: Rating outside of limits. Please enter a number between 1 and 5." << endl;
                }
        
                if (Finance.editReview(Finance, userNumber, newRating, newReview) == true)
                    cout << "REVIEW AND RATING EDITED" << endl << endl;
                else
                    cout << "**Error: Review and Rating NOT edited correctly**" << endl; 
            }
        
        }
        
        if (optionNum == 5) //REMOVE 1 RATING WEBSITES 
        {
            cout << "Now removing all websites with a 1 review" << endl;
            if (Finance.removeWebsite(Finance) == true) //at least one item was removed
                cout << "ALL 1 RATINGS REMOVED FROM TABLE" << endl << endl;
            else
                cout << "**No 1 ratings found, nothing removed.**" << endl;
            cout << endl;
        }
        
        if (optionNum == 6) //EXIT PROGRAM 
        {
            cout << "Exiting program now. Thank you and have a nice day." << endl;
            return 0;
        }
    }
    return 0;
}

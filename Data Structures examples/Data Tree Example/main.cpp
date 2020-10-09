//TREE TABLE 

#include "App.h"

int main()
{
    Table Finance;
    char fileName[] = "data.txt";
    Websites parm;
    Websites *temp;
    char topic[MAX_CHAR];
    char website[MAX_CHAR];
    char keyword[MAX_CHAR];
    char summary[MAX_CHAR];
    char review[MAX_CHAR];
    int rating;    
    char option;
    int optionNum = 0;

//load our websites into Finance table 
    Finance.loadFromFile(fileName);

    cout << "Welcome back to your saved websites tree. " << endl;
    
    while (optionNum != 6)
    {
        optionNum = 0; //reset optionNum
        while (optionNum < 1 || optionNum > 6)
        {
            cout << "----------------------------------------------------------------------------" << endl;
            cout << "Please choose from the following options: " << endl;
            cout << "1. Display all websites and information (sorted by keyword, alphabetically)." << endl;
            cout << "2. Add a new website." << endl;
            cout << "3. Remove first occurance of website based on keyword." << endl;
            cout << "4. Remove all websites containting keyword." << endl;
            cout << "5. Retrieve first occurance of website info based on keyword(s)." << endl;
            cout << "6. Exit the program." << endl;
         
            cin >> optionNum;
            cin.ignore(MAX_CHAR, '\n');
            
            //checks if user input is within bounds
            if (optionNum < 1 || optionNum > 6)
                cout << "Option not available, please try again" << endl;
            cout << endl;
        }
        
        if (optionNum == 1) //Display All websites in keyword order
        {
            cout << endl << "Displaying all your websites by keyword in alphabetical order: " << endl << endl;
            Finance.displayAll();
            cout << endl;
        }
        
        else if (optionNum == 2) //Insert a new Website into the tree
        {
            //tree gets rearranged to insert it alphabetically by keyword
            cout << "Add a website:" << endl;
            cout << "Enter Topic: ";
            cin.getline(topic, MAX_CHAR, '\n');
            cout << "Enter Website Address: ";
            cin.getline(website, MAX_CHAR, '\n');
            cout << "Enter Keyword(s): ";
            cin.getline(keyword, MAX_CHAR, '\n');
            cout << "Enter Summary: ";
            cin.getline(summary, MAX_CHAR, '\n');
            cout << "Enter Review: ";
            cin.getline(review, MAX_CHAR, '\n');
            cout << "Enter Rating: ";
            cin >> rating; 
            cin.ignore(MAX_CHAR, '\n');
            parm.setTopic(topic);
            parm.setWebsite(website);
            parm.setKeyword(keyword);
            parm.setSummary(summary);
            parm.setReview(review);
            parm.setRating(rating);
            Finance.add(parm);
            cout << "WEBSITE INFORMATION ADDED TO SAVED TABLE" << endl << endl;
            parm.clearAll();
        }
        
        else if (optionNum == 3) //Removes a website by searching for a keyword
        {
            cout << "Enter keyword(s) to delete a website: ";
            cin.getline(keyword, MAX_CHAR, '\n');
            char *key = new char[strlen(keyword)+1];
            strcpy(key, keyword);
            temp = Finance.retrieve(key);
            if (temp == nullptr)
                cout << "Sorry, no websites found with that keyword.";
            else
            {
                cout << "This is the website I've found." << endl;
                cout << *temp;
                cout << "Would you like to delete this still? (y/n): ";
                cin >> option;
                cin.ignore(MAX_CHAR, '\n');
            }
            if (option == 'y')
            {
                if(Finance.remove(key) == true)
                    cout << "Website Removed successfully" << endl << endl;
                else
                    cout << "**No website found to remove**" << endl << endl;
            }
            delete [] key;
            temp = nullptr;
        }
        
        else if (optionNum == 4)//Removes ALL items that match a searched keyword 
        {
        //(keyword: "stock" or "finance" both appear twice, for testing purposes)
            cout << "Enter keyword(s) to delete a website: ";
            cin.getline(keyword, MAX_CHAR, '\n');
            char *key = new char[strlen(keyword)+1];
            strcpy(key, keyword);
            
        //go through Finance and remove all items matching keyword
            cout << "Size of list before removal: " << Finance.getSize() << endl;
            if(Finance.removeAll(key) == true)
                cout << "Website(s) Removed successfully" << endl;
            else
                cout << "**No website(s) found in tree to remove**" << endl << endl;
            cout << "Size of list after removal: " << Finance.getSize() << endl;
            
            delete [] key;
            temp = nullptr;            
        }
        
        else if (optionNum == 5) //Retrieve - search tree for keyword, returns first hit
        {
            cout << "Enter a keyword to search websites tree: ";
            cin.getline(keyword, MAX_CHAR, '\n');
            char *newKey = new char[strlen(keyword)+1];
            strcpy(newKey, keyword);
            
            Websites *newTemp;
            newTemp = Finance.retrieve(newKey); //will return a Websites data object, or nullptr if nothing found
            if (newTemp == nullptr)
                cout << "Sorry, no websites found.";
            else
            {
                cout << "First website found for your keyword: " << endl;
                cout << *newTemp << endl;
            }
            delete [] newKey;
            newTemp->clearAll();          
        }
        
        else if (optionNum == 6) //EXIT PROGRAM 
        {
            cout << "Exiting program now. Thank you and have a nice day." << endl;
            return 0;
        }
    }
    return 0;
}


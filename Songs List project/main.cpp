//Patrick Stumbaugh

#include "main.h"

//Global variables
const int MAX = 1000;

int main()
{
    //variables
    int choice = 1;
    Preludes bensPreludes;
    Postludes bensPostludes;
    UMHHymns bensUMHHymns;
    FaithWeSing bensFaithWeSing;

    //itialize all lists
    if (bensPreludes.initialize() == false)
        return 1;
    if (bensPostludes.initialize() == false)
        return 1;
    if (bensUMHHymns.initialize() == false)
        return 1;
    if (bensFaithWeSing.initialize() == false)
        return 1;
    
    
    cout << "Welcome to Ben's church songs list." << endl;
    cout << "Please select a category below: " << endl << endl;
    
    while (choice)
    {
        cout << "   1. Preludes" << endl;
        cout << "   2. Postludes" << endl;
        cout << "   3. UMH Hymns" << endl;
        cout << "   4. The Faith We Sing" << endl;
        cout << "   0. Exit" << endl << endl;
        
        cout << "Your selection: ";
        cin >> choice;
        cin.ignore(MAX, '\n');
        
        cout << endl;
        
        if (choice < 0 || choice > 4) //bad user input, ask again
        {
            cout << "Invalid input, please try again!" << endl << endl;
        }
        
//preludes
        else if (choice == 1)
        {
            bensPreludes.preludesMain();
        }
        
//postludes
        else if (choice == 2)
        {
            bensPostludes.postludesMain();
        }
        
//UMH Hymns
        else if (choice == 3) 
        {
            bensUMHHymns.umhHymnsMain();
        }
        
//The Faith We Sing
        else if (choice == 4)
        {
            bensFaithWeSing.faithWeSingMain();
        }
        
        else if (choice == 0) //don't save and quit
        {
            cout << "Thank you for using my program. Have a nice day!" << endl;
            cout << "REMEMBER TO HIT SAVE UP TOP TO SAVE WORK!" << '\n' << '\n';
            break;
        }
    }

    return 0;
}



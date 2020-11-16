
#include "FaithWeSing.h"
using namespace std;

//global variables
const int MAX = 1000;


void FaithWeSing::faithWeSingMain()
{
    int choice = 1;
    
    while (choice)
    {
        cout << endl << "FAITH WE SING MENU" << endl;
        cout << "Please selection an option below:" << endl;
        cout << "   1. Display all Faith We Sing songs by title and last changed date." << endl;
        cout << "   2. View all information for a specific song." << endl;
        cout << "   3. Edit a specific song." << endl;
        cout << "   4. Add a new song to Faith We Sing." << endl;
        cout << "   5. Delete a song from Faith We Sing." << endl;
        cout << "   0. Save and quit to main menu." << endl;
        cout << endl;
        cout << "Your selection: ";
        cin >> choice;
        cin.ignore(MAX, '\n');
        cout << "\n\n";
        
        if (choice < 0 || choice > 5) //bad input 
        {
            cout << "Invalid input. Please try again" << endl << endl;
        }
        
    //display all titles and last MOD date 
        else if (choice == 1)
        {
            displaySongTitlesAndDateMOD();
            cout << endl << endl;
        }
    //display all information for a specific song
        else if (choice == 2)
        {
            dispalyAllInfoSpecificSong();
            cout << endl << endl;
        }
    //View/edit a song
        else if (choice == 3)
        {
            if (editSong() == false)
                cout << "ERROR EDITING SONG." << endl << endl;
        }
    //Add a new song
        else if (choice == 4)
        {
            if (addNewSong() == false)
                cout << "ERROR. PLEASE TRY AGAIN." << endl << endl;
            else
                cout << endl << "New Faith We Sing song added successfully." << endl << endl;
        }
    //Delete a song
        else if (choice == 5)
        {
            if (deleteSong() == false)
                cout << "ERROR. PLEASE TRY AGAIN." << endl << endl;
            else
                cout << endl << endl;
        }
    //Save and quit to main menu
        else if (choice == 0)
        {
            saveToFile();
            return;
        }
        
    }
    return;
}

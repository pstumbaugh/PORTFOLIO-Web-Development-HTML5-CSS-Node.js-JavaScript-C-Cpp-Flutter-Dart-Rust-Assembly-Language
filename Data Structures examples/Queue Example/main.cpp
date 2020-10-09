//QUEUE

// This program will take restaurant reservations. It will store the upcoming 
// reservations in a Queue format. It will also ask if the user wants to be on 
// a promotional email list, in which that information will be stored as a stack.



#include "app.h"
using namespace std;

//global variables
const int MAX = 100;

int main ()
{
    //local variables
    int option = 0; //control for which choice selected
    bool choice = true; //control for choices loop
    char wantPromos = 'n'; //control choice if user wants promotional material 
    char promoPrint = 'n'; //control for printing to promotional list or not
    char fileName[] = "CouponsList.txt"; 
    Queue queueInfo;
    Stack stackInfo;
    Guest guestInfo;
    
    char newGroupName[MAX];
    int newNumberOfPeople = 0;
    char newWheelChair;
    char newHighChair;
    char newName[MAX];
    char newEmail[MAX];

    
    //Introduce Program 
    cout << "Welcome to the CS Restaurant Management System" << endl;
    
    //Display choices for user
    while (choice == true)
    {
        cout << endl << "Please choose the number of the option you wish to perform." << endl;
        
        cout << "1. Make a new reservation" << endl;
        cout << "2. Call the next reservation in line (also removes reservation from system)" << endl;
        cout << "3. See who's next in line" << endl;
        cout << "4. Print out all upcoming reservations (in order)" << endl;
        cout << "5. Print a list of people signed up for coupons" << endl;
        cout << "6. Exit the system" << endl;
        
        cout << "What would you like to do? " << endl;
        
        cin >> option; //user selection
        cin.ignore(MAX, '\n');
        cout << endl;
        
        if (option <= 0 || option >=7) //check if input is outside bounds
        {
            cout << "**Unrecognized input, please try again**" << endl;
        }
        
        else
        {
            if (option == 1) //make new reservation 
            {
                //prompt for reservation information, store to guestInfo temprorarily 
                cout << "MAKING A NEW RESERVATION: " << endl;
                cout << "Group name: ";

                cin.getline(newGroupName, MAX, '\n');
                guestInfo.setGroupName(newGroupName);
                
                cout << "Number of people: ";
                cin >> newNumberOfPeople;
                cin.ignore(MAX, '\n');
                guestInfo.setNumberOfPeople(newNumberOfPeople);
                
                cout << "Wheelchair needed? y/n: ";
                cin >> newWheelChair;
                cin.ignore(MAX, '\n');
                if (newWheelChair == 'y' || newWheelChair == 'Y')
                    guestInfo.setWheelChair();
                
                cout << "Highchair needed? y/n: ";
                cin >> newHighChair;
                cin.ignore(MAX, '\n');
                if (newHighChair == 'y' || newHighChair == 'Y')
                    guestInfo.setHighChair();
                
                cout << "Would you like to receive promotional material? y/n: ";
                cin >> wantPromos;
                cin.ignore(MAX, '\n');
                if (wantPromos == 'y' || wantPromos == 'Y')
                {
                    cout << "What is your name? ";
                    cin.getline(newName, MAX, '\n');
                    guestInfo.setName(newName);
                    
                    cout << "What is your email? ";
                    cin.getline(newEmail, MAX, '\n');
                    guestInfo.setEmail(newEmail);
                    
                    stackInfo.push(guestInfo); //push the guest info into the stack (if option was selected)
                }
                
                queueInfo.enqueue(guestInfo); //push the guest info into the queue
                cout << "RESERVATION CONFIRMED" << endl;
            }
            
            else if (option == 2) //call next reservation / pop reservation
            {
                if (queueInfo.getNext() == false) //if no reservations, display error
                    cout << "**No upcoming reservations**" << endl;
                else
                {
                    cout << "NEXT RESERVATION: " << endl << queueInfo;
                    queueInfo.dequeue();
                }
            }
            
            else if (option == 3) //peek at who's next in line
            {
                if (queueInfo.isEmpty() == true) //if no reservations, display error
                    cout << "**No upcoming reservations**" << endl;
                else
                {
                    cout << "NEXT IN LINE: ";
                    cout << queueInfo.peek() << endl;
                }
            }
            
            else if (option == 4) //print upcoming reservation group names 
            {
                if (queueInfo.isEmpty() == true) //if no reservations, display error
                    cout << "**No upcoming reservations**" << endl;
                else
                {
                    cout << "UPCOMING RESERVATIONS: " << endl;
                    queueInfo.display();
                }
            }
            
            else if (option == 5) //print list of people on promotional list
            {
                if (stackInfo.isEmpty() == false) //if list is not empty
                {
                    //print promotional list from top of stack downwards
                    cout << "PROMOTIONAL LIST (most recent first): " << endl;
                    stackInfo.display();
                    cout << endl;
                    cout << "Would you like to save this information to CouponsList.txt? " << endl;
                    cout << "Note: this will also remove all data after saving." << endl;
                    cout << "y/n? ";
                    cin >> promoPrint;
                    cin.ignore(MAX, '\n');
                    if (promoPrint == 'y' || promoPrint == 'Y')
                    {
                        //saves all stack info to file "CouponsList.txt", then deletes stack info
                        stackInfo.saveToFile(fileName);
                        while (stackInfo.isEmpty() != true)
                        {
                            Guest aGuest;
                            stackInfo.popAll();
                            cout << "List saved to external file and data removed" << endl;
                        }
                    }
                }
                else //display error - list is empty
                {
                    cout << "**Nothing in list to display**" << endl;
                }
            }
            
            else if (option == 6) //exit from loop
            {
                choice = false;
            }
        }
        guestInfo.clearAll(); //clears all info in guestInfo back to defaults (makes it ready for next guest info)
    }
    
    //display goodbye message, then exit 
    cout << endl << "Thank you and have a nice day." << endl << endl;
    return 0;
}

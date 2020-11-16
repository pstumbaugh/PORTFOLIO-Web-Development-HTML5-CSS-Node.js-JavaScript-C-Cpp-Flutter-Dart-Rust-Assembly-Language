#include "FaithWeSing.h"
using namespace std;

//global variables
const int MAX = 500;

//default constructor
FaithWeSing::FaithWeSing()
{
    head = nullptr;
    Node();
}



//default destructor
FaithWeSing::~FaithWeSing()
{
    destroy();
}



//Destroy linked list
void FaithWeSing::destroy()
{
    Node *current = head;
    while (current != nullptr)
    {
        head = current->next;
        delete current;
        current = head;
    }
}



//opens Faith We Sing file, saves it to calling object of Faith We Sing class
//returns false if there are any errors
bool FaithWeSing::initialize()
{
    ifstream file;
    bool flag = true;
    char *newSongTitle = new char[MAX];
    char *newSongNumber = new char[MAX];
    char *newPageNumber = new char[MAX];
    char *newDateMOD = new char[MAX];
    
//Attempt to open data file
    file.open("faithWeSing.txt"); 
    if(file.good() != true)  // If file open failed...
    {
        cout << "ERROR: UNABLE TO OPEN FAITH WE SING FILE" << endl;
        flag = false;
    }
    
    if (file.peek() == '^') // empty file, don't do anything
        return true;
    
    while(!file.eof())
    {

        file.get(newSongTitle, MAX-1, '\n');
        file.get();
        file.get(newSongNumber, MAX-1, '\n');
        file.get();
        file.get(newPageNumber, MAX-1, '\n');
        file.get();
        file.get(newDateMOD, MAX-1, '\n');
        file.get();


        if (this->addNewSongFromFile(newSongTitle, newSongTitle, newPageNumber, 
            newDateMOD) == false)
        {
            cout << "ERROR IMPORTING FAITH WE SING FROM FILE" << endl;
            flag = false;
            break;
        };

        if (file.peek() == '^') //using as an EOF indicator
        {
            flag = true;
            break;
        }
    }
    
    file.close();

    //delete temp heap variables
    delete [] newSongTitle;
    delete [] newSongNumber;
    delete [] newDateMOD;
    delete [] newPageNumber;

    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}



//saves all Faith We Sing to Faith We Sing file
void FaithWeSing::saveToFile() const
{
    ofstream out;
    const char *fileName = "faithWeSing.txt";

    out.open(fileName);
    if(!out)
    {
            cout << "Fail to open " << fileName << " for writing!" << endl;
            out.close();
    }

    Node *current = head;
    while (current != nullptr)
    {
            out << current->songTitle << endl;
            out << current->songNumber << endl;
            out << current->pageNumber << endl;
            out << current->dateMOD << endl;
                
            current = current->next;
    }
    
    out << "^";
    
    out.close();
}



//adds a new song to our list 
//returns false if any errors copying
bool FaithWeSing::addNewSong()
{
    //variables (some stored on heap, deleted at end of function)
    bool flag = true;
    Node *current = head;
    char *newSongTitle = new char[MAX];
    char *newSongNumber = new char[MAX];
    char *newPageNumber = new char[MAX];
    char *newDateMOD = new char[MAX];

    //get new song's information
    bool songTitleFlag = false; //checks song title lenght to be under 50
    while (songTitleFlag == false)
    {
        cout << "Song title: ";
        cin.getline(newSongTitle, MAX, '\n');
        if (strlen(newSongTitle) > 50)
        {
            cout << "**Song title too long, please enter again under 50 characters." << endl;
            songTitleFlag = false;
        }
        else
            songTitleFlag = true;
    }
    cout << "Song Number: ";
    cin.getline(newSongNumber, MAX, '\n');
    
    cout << "Page Number(s): ";
    cin.getline(newPageNumber, MAX, '\n');

    cout << "Last changed date: ";
    cin.getline(newDateMOD, MAX, '\n');
    
    
    //if songs list is empty
    if (current == nullptr)
    {
        Node *newNode = new Node();
        this->head = newNode;
        newNode->next = nullptr;
        if (newNode->editSongTitle(newSongTitle) == false)
            flag = false;
        if (newNode->editSongNumber(newSongNumber) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false) //since new song, using dateORI as dateMOD
            flag = false;
        else //everything worked, return true
            flag = true;
    }
    else //if there are songs in the list
    {
        //get to end of list
        while (current->next != nullptr)
        {
            current = current->next;
        }
        
        //then add song to end of list
        Node *newNode = new Node();
        current->next = newNode;
        newNode->next = nullptr;
        if (newNode->editSongTitle(newSongTitle) == false)
            flag = false;
        if (newNode->editSongNumber(newSongNumber) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false) //since new song, using dateORI as dateMOD
            flag = false;
        else //everything worked, return true
            flag = true;
    }
    
    //delete temp heap variables
    delete [] newSongTitle;
    delete [] newSongNumber;
    delete [] newDateMOD;
    delete [] newPageNumber;

    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}


bool FaithWeSing::addNewSongFromFile(char *newSongTitle, char *newSongNumber, 
    char *newPageNumber, char *newDateMOD)
{
    bool flag = true;
    Node *current = head;

    //if songs list is empty
    if (current == nullptr)
    {
        Node *newNode = new Node();
        this->head = newNode;
        newNode->next = nullptr;
        if (newNode->editSongTitle(newSongTitle) == false)
            flag = false;
        if (newNode->editSongNumber(newSongNumber) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false) //since new song, using dateORI as dateMOD
            flag = false;
        else //everything worked, return true
            flag = true;
    }
    else //if there are songs in the list
    {
        //get to end of list
        while (current->next != nullptr)
        {
            current = current->next;
        }
        
        //then add song to end of list
        Node *newNode = new Node();
        current->next = newNode;
        newNode->next = nullptr;
        if (newNode->editSongTitle(newSongTitle) == false)
            flag = false;
        if (newNode->editSongNumber(newSongNumber) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false) //since new song, using dateORI as dateMOD
            flag = false;
        else //everything worked, return true
            flag = true;
    }

    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}





void FaithWeSing::displaySongTitles()
{
    Node *current = head;
    while (current != nullptr)
    {
        cout << current->songTitle << endl;
        current = current->next;
    }
    return;
}


void FaithWeSing::displaySongTitlesAndDateMOD()
{
    Node *current = head;
    
    if (current == nullptr) // empty list 
    {
        cout << "No Faith We Sing songs saved." << endl << endl;
        return;
    }
    while (current != nullptr)
    {
        cout << current->songTitle;
        cout << setw(55-strlen(current->songTitle)) << right;
        cout << "   Last Changed: " << current->dateMOD << endl;
        current = current->next;
    }
    return;
}


//user selects a song, then it displays all information about that song
void FaithWeSing::dispalyAllInfoSpecificSong()
{
    int songNumber = 1;
    int userSongSelection;
    int userEdit;
    
    cout << "Please choose a song from the list below to edit:" << endl;
    Node *current = head;
    while (current != nullptr)
    {
        cout << songNumber << ". ";
        current->displaySingleSongTitle();
        cout << endl;
        current = current->next;
        songNumber++;
    }
    
    cout << "Your selection: ";
    cin >> userSongSelection;
    cin.ignore(MAX, '\n');
    cout << endl << endl;
    
    if (userSongSelection >= songNumber || userSongSelection < 1) // out of bounds
    {
        cout << "Invalid input" << endl;
        return;
    }
    
    current = head; //reset current
    
    //get to song number selected
    for (int temp = 1; temp < userSongSelection; temp++)
    {
        current = current->next;
    }
    
    current->displaySingleSongAllInfo(current);

}


void FaithWeSing::displayAllSongInfo()
{
    Node *current = head;
    while (current != nullptr)
    {
        cout << current;
        current = current->next;
    }
    return;
}



//edits a song from the list 
//returns true is edited successfully
bool FaithWeSing::editSong()
{
    int songNumber = 1;
    int userSongSelection;
    int userEdit;
    
    cout << "Please choose a song from the list below to edit:" << endl;
    Node *current = head;
    while (current != nullptr)
    {
        cout << songNumber << ". ";
        current->displaySingleSongTitle();
        cout << endl;
        current = current->next;
        songNumber++;
    }
    
    cout << "Your selection: ";
    cin >> userSongSelection;
    cin.ignore(MAX, '\n');
    
    if (userSongSelection >= songNumber || userSongSelection < 1) // out of bounds
    {
        cout << "Invalid input" << endl;
        return false;
    }
    
    current = head; //reset current
    
    //get to song number selected
    for (int temp = 1; temp < userSongSelection; temp++)
    {
        current = current->next;
    }
    
    cout << endl << "You are editing: ";
    current->displaySingleSongTitle();
    cout << endl << endl;
    
    cout << "What would you like to change?" << endl;
    cout << "   1. Title" << endl;
    cout << "   2. Song Number" << endl;
    cout << "   3. Page Number" << endl;
    cout << "   4. Date Changed" << endl;
    cout << "   0. Exit" << endl;
    cout << "Your selection: ";
    cin >> userEdit;
    cin.ignore(MAX, '\n');
    
    if (userEdit == 1) //changed title
    {
        char *newSongTitle = new char[MAX];
        cout << "What would you like the title to change to? " << endl;
        cin.getline(newSongTitle, MAX, '\n');
        if (current->editSongTitle(newSongTitle) == true)
        {
            cout << "Title changed successfully" << endl;
            delete [] newSongTitle;
            return true;
        }   
        else
        {
            delete [] newSongTitle;
            return false;
        }
    }
    else if (userEdit == 2) //change song number
    {
        char *newSongNumber = new char[MAX];
        cout << "What would you like the song number to change to? " << endl;
        cin.getline(newSongNumber, MAX, '\n');
        if (current->editSongNumber(newSongNumber) == true)
        {
            cout << "Composer changed successfully" << endl;
            delete [] newSongNumber;
            return true;
        }
        else
        {
            delete [] newSongNumber;
            return false;
        }
    }
    else if (userEdit == 3) //change page number
    {
        char *newPageNumber = new char[MAX];
        cout << "What would you like the page number to change to? " << endl;
        cin.getline(newPageNumber, MAX, '\n');
        if (current->editPageNumber(newPageNumber) == true)
        {
            cout << "Page number changed successfully" << endl;
            delete [] newPageNumber;
            return true;
        }
        else
        {
            delete [] newPageNumber;
            return false;
        }
    }
    else if (userEdit == 4) //change date Changed
    {
        char *newDateMOD = new char[MAX];
        cout << "What would you like the changed date to be? " << endl;
        cin.getline(newDateMOD, MAX, '\n');
        if (current->editDateMOD(newDateMOD) == true)
        {
            cout << "Changed date changed successfully" << endl;
            delete [] newDateMOD;
            return true;
        }
        else
        {
            delete [] newDateMOD;
            return false;
        }
    }
    else if (userEdit == 0)
        return true;
        
    return true;
}


//deletes a user's song. Returns false if error occures
bool FaithWeSing::deleteSong()
{
    bool flag = false;
    int userSongSelection;
    int songNumber = 1;
    char toDelete;
    int userEdit;
    Node *current = head;

    if (current == nullptr)
    {
        cout << "No songs in list to delete" << endl;
        return true;
    }
    
    cout << "Please choose a song from the list below to delete:" << endl;
    while (current != nullptr)
    {
        cout << songNumber << ". ";
        current->displaySingleSongTitle();
        cout << endl;
        current = current->next;
        songNumber++;
    }

    cout << "Your selection: ";
    cin >> userSongSelection;
    cin.ignore(MAX, '\n');
    
    if (userSongSelection >= songNumber || userSongSelection < 1) // out of bounds
    {
        cout << "Invalid input, please try again." << endl;
        return true;
    }
    
    current = head; //reset current
    
    //get to song number selected
    for (int temp = 1; temp < userSongSelection; temp++)
    {
        current = current->next;
    }
    
    cout << endl << "Are you sure you want to delete this song? " << endl;
    current->displaySingleSongTitle();
    cout << endl;
    cout << "y / n : ";
    cin >> toDelete;
    cin.ignore(MAX, '\n');
    cout << endl;
    
    if (toDelete != 'y') //don't delete the song
    {
        cout << "Song not deleted, returning to menu" << endl;
        return true;
    }
    
    if (head == current) //first item in list
    {
        if (current->next == nullptr) //only one item in list 
        {
            delete current;
            head = nullptr;
            cout << "Song deleted successfully.";
            return true;
        }
        else
        {
            head = current->next;
            delete current;
            cout << "Song deleted successfully.";
            return true;
        }
    }
    else
    {
        Node *temp = head;
        while (temp->next != current) //get to the item before current
        {
            temp = temp->next;
        }
        if (current->next == nullptr) //if it's the last item in list
        {
            temp->next = nullptr;
            delete current;
            cout << "Song deleted successfully.";
            return true;
        }
        else
        {
            temp->next = current->next;
            delete current;
            cout << "Song deleted successfully.";
            return true;
        }
    }
    return false;
}



void FaithWeSing::Node::displaySingleSongTitle()
{
    cout << songTitle;
}



//*************NODE EDIT FUNCTIONS****************

//copies over song's songTitle
bool FaithWeSing::Node::editSongTitle(char *newSongTitle)
{
    if (this->songTitle) //if something already in songTitle, delete it
        delete [] this->songTitle;
    this->songTitle = new char[strlen(newSongTitle)+1];
    if (strcpy(this->songTitle,newSongTitle))
        return true;
    else
        return false;
}


bool FaithWeSing::Node::editSongNumber(char *newSongNumber)
{
    if (this->songNumber) //if something already in songNumber, delete it
        delete [] this->songNumber;
    this->songNumber = new char[strlen(newSongNumber)+1];
    if (strcpy(this->songNumber,newSongNumber))
        return true;
    else
        return false;
}



bool FaithWeSing::Node::editPageNumber (char *newPageNumber)
{
    if (this->pageNumber) //if something already in pageNumber, delete it
        delete [] this->pageNumber;
    this->pageNumber = new char[strlen(newPageNumber)+1];
    if (strcpy(this->pageNumber,newPageNumber))
        return true;
    else
        return false;
}



bool FaithWeSing::Node::editDateMOD(char *newDateMOD)
{
    if (dateMOD) //if something already in dateMOD, delete it
        delete [] this->dateMOD;
    this->dateMOD = new char[strlen(newDateMOD)+1];
    if (strcpy(this->dateMOD,newDateMOD))
        return true;
    else
        return false;
}


void FaithWeSing::Node::displaySingleSongAllInfo(Node *current)
{
    cout << current->songTitle << endl;
    cout << "    Song Number: " << current->songNumber << endl;
    cout << "    Page Number: " << current->pageNumber << endl;
    cout << "    Last Changed: " << current->dateMOD << endl;
}



//overload friend << operator
//OUTPUT: out (which includes all info)
std::ostream& operator<<(std::ostream& out, FaithWeSing& songList)
{
    FaithWeSing::Node *temp = songList.head;
    while (temp != nullptr)
    {
        out << temp->songTitle << endl;
        out << "    songNumber: " << temp->songNumber << endl;
        out << "    Page Number: " << temp->pageNumber << endl;
        out << "    Last Changed: " << temp->dateMOD << endl;
        temp = temp->next;
    }
    cout << endl;
    return out;
}


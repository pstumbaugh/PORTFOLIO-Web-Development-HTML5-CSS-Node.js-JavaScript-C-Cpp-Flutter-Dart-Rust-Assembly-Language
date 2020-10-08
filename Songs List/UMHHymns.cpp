#include "UMHHymns.h"
using namespace std;

//global variables
const int MAX = 500;

//default constructor
UMHHymns::UMHHymns()
{
    head = nullptr;
    Node();
}



//default destructor
UMHHymns::~UMHHymns()
{
    destroy();
}



//Destroy linked list
void UMHHymns::destroy()
{
    Node *current = head;
    while (current != nullptr)
    {
        head = current->next;
        delete current;
        current = head;
    }
}



//opens UMH Hymns file, saves it to calling object of UMH Hymns class
//returns false if there are any errors
bool UMHHymns::initialize()
{
    ifstream file;
    bool flag = true;
    char *newSongTitle = new char[MAX];
    char *newHymnNumber = new char[MAX];
    char *newDateMOD = new char[MAX];
    
//Attempt to open data file
    file.open("umh.txt"); 
    if(file.good() != true)  // If file open failed...
    {
        cout << "ERROR: UNABLE TO OPEN UMH HYMNS FILE" << endl;
        flag = false;
    }
    
    if (file.peek() == '^') // empty file, don't do anything
        return true;
    
    while(!file.eof())
    {

        file.get(newSongTitle, MAX-1, '\n');
        file.get();
        file.get(newHymnNumber, MAX-1, '\n');
        file.get();
        file.get(newDateMOD, MAX-1, '\n');
        file.get();


        if (this->addNewSongFromFile(newSongTitle, newHymnNumber,
            newDateMOD) == false)
        {
            cout << "ERROR IMPORTING UMH HYMNS FROM FILE" << endl;
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
    delete [] newHymnNumber;
    delete [] newDateMOD;
    
    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}



//saves all UMH Hymns to UMH Hymns file
void UMHHymns::saveToFile() const
{
    ofstream out;
    const char *fileName = "umh.txt";

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
            out << current->hymnNumber << endl;
            out << current->dateMOD << endl;
                
            current = current->next;
    }
    
    out << "^";
    
    out.close();
}



//adds a new song to our list 
//returns false if any errors copying
bool UMHHymns::addNewSong()
{
    //variables (some stored on heap, deleted at end of function)
    bool flag = true;
    Node *current = head;
    char *newSongTitle = new char[MAX];
    char *newHymnNumber = new char[MAX];
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
    cout << "Hymn Number: ";
    cin.getline(newHymnNumber, MAX, '\n');\

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
        if (newNode->editHymnNumber(newHymnNumber) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false)
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
        if (newNode->editHymnNumber(newHymnNumber) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false) //since new song, using dateORI as dateMOD
            flag = false;
        else //everything worked, return true
            flag = true;
    }
    
    //delete temp heap variables
    delete [] newSongTitle;
    delete [] newHymnNumber;
    delete [] newDateMOD;

    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}


bool UMHHymns::addNewSongFromFile(char *newSongTitle, char *newHymnNumber, 
    char *newDateMOD)
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
        if (newNode->editHymnNumber(newHymnNumber) == false)
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
        if (newNode->editHymnNumber(newHymnNumber) == false)
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





void UMHHymns::displaySongTitles()
{
    Node *current = head;
    while (current != nullptr)
    {
        cout << current->songTitle << endl;
        current = current->next;
    }
    return;
}


void UMHHymns::displaySongTitlesAndDateMOD()
{
    Node *current = head;
    
    if (current == nullptr) // empty list 
    {
        cout << "No UMH Hymns saved." << endl << endl;
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
void UMHHymns::dispalyAllInfoSpecificSong()
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


void UMHHymns::displayAllSongInfo()
{
    Node *current = head;
    while (current != nullptr)
    {
        cout << current; //uses overloaded << operator
        current = current->next;
    }
    return;
}



//edits a song from the list 
//returns true is edited successfully
bool UMHHymns::editSong()
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
    cout << "   2. Hymn Number" << endl;
    cout << "   3. Date Changed" << endl;
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
    else if (userEdit == 2) //change hymn number
    {
        char *newHymnNumber = new char[MAX];
        cout << "What would you like the Hymn number to change to? " << endl;
        cin.getline(newHymnNumber, MAX, '\n');
        if (current->editHymnNumber(newHymnNumber) == true)
        {
            cout << "Composer changed successfully" << endl;
            delete [] newHymnNumber;
            return true;
        }
        else
        {
            delete [] newHymnNumber;
            return false;
        }
    }
    else if (userEdit == 3) //change date Changed
    {
        char *newDateMOD = new char[MAX];
        cout << "What would you like the changed date to be? " << endl;
        cin.getline(newDateMOD, MAX, '\n');
        if (current->editDateMOD(newDateMOD) == true)
        {
            cout << "Date changed successfully" << endl;
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
bool UMHHymns::deleteSong()
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



void UMHHymns::Node::displaySingleSongTitle()
{
    cout << songTitle;
}



//*************NODE EDIT FUNCTIONS****************

//copies over song's songTitle
bool UMHHymns::Node::editSongTitle(char *newSongTitle)
{
    if (this->songTitle) //if something already in songTitle, delete it
        delete [] this->songTitle;
    this->songTitle = new char[strlen(newSongTitle)+1];
    if (strcpy(this->songTitle,newSongTitle))
        return true;
    else
        return false;
}


bool UMHHymns::Node::editHymnNumber(char *newHymnNumber)
{
    if (this->hymnNumber) //if something already in hymnNumber, delete it
        delete [] this->hymnNumber;
    this->hymnNumber = new char[strlen(newHymnNumber)+1];
    if (strcpy(this->hymnNumber,newHymnNumber))
        return true;
    else
        return false;
}



bool UMHHymns::Node::editDateMOD(char *newDateMOD)
{
    if (dateMOD) //if something already in dateMOD, delete it
        delete [] this->dateMOD;
    this->dateMOD = new char[strlen(newDateMOD)+1];
    if (strcpy(this->dateMOD,newDateMOD))
        return true;
    else
        return false;
}


void UMHHymns::Node::displaySingleSongAllInfo(Node *current)
{
    cout << current->songTitle << endl;
    cout << "    Hymn Number: " << current->hymnNumber << endl;
    cout << "    Last Changed: " << current->dateMOD << endl;
}



//overload friend << operator
//OUTPUT: out (which includes all info)
std::ostream& operator<<(std::ostream& out, UMHHymns& songList)
{
    UMHHymns::Node *temp = songList.head;
    while (temp != nullptr)
    {
        out << temp->songTitle << endl;
        out << "    Hymn Number: " << temp->hymnNumber << endl;
        out << "    Last Changed: " << temp->dateMOD << endl;
        temp = temp->next;
    }
    cout << endl;
    return out;
}


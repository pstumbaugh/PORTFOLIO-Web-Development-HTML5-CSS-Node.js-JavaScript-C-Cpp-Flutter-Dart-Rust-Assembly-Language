#include "Postludes.h"
using namespace std;

//global variables
const int MAX = 500;

//default constructor
Postludes::Postludes()
{
    head = nullptr;
    Node();
}



//default destructor
Postludes::~Postludes()
{
    destroy();
}



//Destroy linked list
void Postludes::destroy()
{
    Node *current = head;
    while (current != nullptr)
    {
        head = current->next;
        delete current;
        current = head;
    }
}



//opens postludes file, saves it to calling object of postludes class
//returns false if there are any errors
bool Postludes::initialize()
{
    ifstream file;
    bool flag = true;
    char *newSongTitle = new char[MAX];
    char *newComposer = new char[MAX];
    int newYearComposed;
    char *newBookTitle = new char[MAX];
    char *newPageNumber = new char[MAX];
    char *newPhysicalDescription = new char[MAX];
    char *newDateMOD = new char[MAX];
    
//Attempt to open data file
    file.open("postludes.txt"); 
    if(file.good() != true)  // If file open failed...
    {
        cout << "ERROR: UNABLE TO OPEN POSTLUDES FILE" << endl;
        flag = false;
    }
    
    if (file.peek() == '^') // empty file, don't do anything
        return true;
    
    while(!file.eof())
    {

        file.get(newSongTitle, MAX-1, '\n');
        file.get();
        file.get(newComposer, MAX-1, '\n');
        file.get();
        file >> newYearComposed;
        file.get();
        file.get(newBookTitle, MAX-1, '\n');
        file.get();
        file.get(newPageNumber, MAX-1, '\n');
        file.get();
        file.get(newPhysicalDescription, MAX-1, '\n');
        file.get();
        file.get(newDateMOD, MAX-1, '\n');
        file.get();


        if (this->addNewSongFromFile(newSongTitle, newComposer, newYearComposed, newBookTitle, newPageNumber, newPhysicalDescription, newDateMOD) == false)
        {
            cout << "ERROR IMPORTING POSTLUDES FROM FILE" << endl;
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
    delete [] newComposer;
    delete [] newDateMOD;
    delete [] newBookTitle;
    delete [] newPageNumber;
    delete [] newPhysicalDescription;
    
    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}



//saves all postludes to postludes file
void Postludes::saveToFile() const
{
    ofstream out;
    const char *fileName = "postludes.txt";

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
            out << current->composer << endl;
            out << current->yearComposed << endl;
            out << current->bookTitle << endl; 
            out << current->pageNumber << endl;
            out << current->physicalDescription << endl;
            out << current->dateMOD << endl;
                
            current = current->next;
    }
    
    out << "^";
    
    out.close();
}



//adds a new song to our list 
//returns false if any errors copying
bool Postludes::addNewSong()
{
    //variables (some stored on heap, deleted at end of function)
    bool flag = true;
    Node *current = head;
    char *newSongTitle = new char[MAX];
    char *newComposer = new char[MAX];
    int newYearComposed;
    char *newBookTitle = new char[MAX];
    char *newPageNumber = new char[MAX];
    char *newPhysicalDescription = new char[MAX];
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
    cout << "Composer: ";
    cin.getline(newComposer, MAX, '\n');
    
    cout << "Year Composed (number only): ";
    cin >> newYearComposed;
    cin.ignore(MAX, '\n');   
    
    cout << "Book Title: ";
    cin.getline(newBookTitle, MAX, '\n');
    
    cout << "Page Number(s): ";
    cin.getline(newPageNumber, MAX, '\n');

    cout << "Physical Description: ";
    cin.getline(newPhysicalDescription, MAX, '\n');

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
        if (newNode->editComposer(newComposer) == false)
            flag = false;
        if (newNode->editYearComposed(newYearComposed) == false)
            flag = false;
        if (newNode->editBookTitle(newBookTitle) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editPhysicalDescription(newPhysicalDescription) == false)
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
        if (newNode->editComposer(newComposer) == false)
            flag = false;
        if (newNode->editYearComposed(newYearComposed) == false)
            flag = false;
        if (newNode->editBookTitle(newBookTitle) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editPhysicalDescription(newPhysicalDescription) == false)
            flag = false;
        if (newNode->editDateMOD(newDateMOD) == false) //since new song, using dateORI as dateMOD
            flag = false;
        else //everything worked, return true
            flag = true;
    }
    
    //delete temp heap variables
    delete [] newSongTitle;
    delete [] newComposer;
    delete [] newDateMOD;
    delete [] newBookTitle;
    delete [] newPageNumber;
    delete [] newPhysicalDescription;

    if (flag = true) //everything worked normally
        return true;
    else
        return false; //if it doesn't add anything, return false
}


bool Postludes::addNewSongFromFile(char *newSongTitle, char *newComposer, 
    int newYearComposed, char *newBookTitle, char *newPageNumber, 
    char *newPhysicalDescription, char *newDateMOD)
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
        if (newNode->editComposer(newComposer) == false)
            flag = false;
        if (newNode->editYearComposed(newYearComposed) == false)
            flag = false;
        if (newNode->editBookTitle(newBookTitle) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editPhysicalDescription(newPhysicalDescription) == false)
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
        if (newNode->editComposer(newComposer) == false)
            flag = false;
        if (newNode->editYearComposed(newYearComposed) == false)
            flag = false;
        if (newNode->editBookTitle(newBookTitle) == false)
            flag = false;
        if (newNode->editPageNumber(newPageNumber) == false)
            flag = false;
        if (newNode->editPhysicalDescription(newPhysicalDescription) == false)
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





void Postludes::displaySongTitles()
{
    Node *current = head;
    while (current != nullptr)
    {
        cout << current->songTitle << endl;
        current = current->next;
    }
    return;
}


void Postludes::displaySongTitlesAndDateMOD()
{
    Node *current = head;
    
    if (current == nullptr) // empty list 
    {
        cout << "No Postludes saved." << endl << endl;
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
void Postludes::dispalyAllInfoSpecificSong()
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


void Postludes::displayAllSongInfo()
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
bool Postludes::editSong()
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
    cout << "   2. Composer" << endl;
    cout << "   3. Year Composed" << endl;
    cout << "   4. Book Title" << endl;
    cout << "   5. Page Number" << endl;
    cout << "   6. Physical Description" << endl;
    cout << "   7. Date Changed" << endl;
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
    else if (userEdit == 2) //change composer
    {
        char *newComposer = new char[MAX];
        cout << "What would you like the composer to change to? " << endl;
        cin.getline(newComposer, MAX, '\n');
        if (current->editComposer(newComposer) == true)
        {
            cout << "Composer changed successfully" << endl;
            delete [] newComposer;
            return true;
        }
        else
        {
            delete [] newComposer;
            return false;
        }
    }
    else if (userEdit == 3) //change year composed
    {
        int newYearComposed;
        cout << "What would you like the year composed to change to? " << endl;
        cin >> newYearComposed;
        cin.ignore(MAX, '\n');
        if (current->editYearComposed(newYearComposed) == true)
        {
            cout << "Year Composed changed successfully" << endl;
            return true;
        }
        else
        {
            return false;
        }
    }
    else if (userEdit == 4) //change book title
    {
        char *newBookTitle = new char[MAX];
        cout << "What would you like the book title to change to? " << endl;
        cin.getline(newBookTitle, MAX, '\n');
        if (current->editBookTitle(newBookTitle) == true)
        {
            cout << "Book title changed successfully" << endl;
            delete [] newBookTitle;
            return true;
        }
        else
        {
            delete [] newBookTitle;
            return false;
        }
    }
    else if (userEdit == 5) //change page number
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
    else if (userEdit == 6) //change physical description
    {
        char *newPhysicalDescription = new char[MAX];
        cout << "What would you like the physical description to change to? " << endl;
        cin.getline(newPhysicalDescription, MAX, '\n');
        if (current->editPhysicalDescription(newPhysicalDescription) == true)
        {
            cout << "Physical description changed successfully" << endl;
            delete [] newPhysicalDescription;
            return true;
        }
        else
        {
            delete [] newPhysicalDescription;
            return false;
        }
    }
    else if (userEdit == 7) //change date Changed
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
bool Postludes::deleteSong()
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



void Postludes::Node::displaySingleSongTitle()
{
    cout << songTitle;
}



//*************NODE EDIT FUNCTIONS****************

//copies over song's songTitle
bool Postludes::Node::editSongTitle(char *newSongTitle)
{
    if (this->songTitle) //if something already in songTitle, delete it
        delete [] this->songTitle;
    this->songTitle = new char[strlen(newSongTitle)+1];
    if (strcpy(this->songTitle,newSongTitle))
        return true;
    else
        return false;
}


bool Postludes::Node::editComposer(char *newComposer)
{
    if (this->composer) //if something already in composer, delete it
        delete [] this->composer;
    this->composer = new char[strlen(newComposer)+1];
    if (strcpy(this->composer,newComposer))
        return true;
    else
        return false;
}


bool Postludes::Node::editYearComposed(int newYearComposed)
{
    this->yearComposed = newYearComposed;
    if (this->yearComposed == newYearComposed)
        return true;
    else
        return false;
}


bool Postludes::Node::editBookTitle (char *newBookTitle)
{
    if (this->bookTitle) //if something already in bookTitle, delete it
        delete [] this->bookTitle;
    this->bookTitle = new char[strlen(newBookTitle)+1];
    if (strcpy(this->bookTitle,newBookTitle))
        return true;
    else
        return false;
}


bool Postludes::Node::editPageNumber (char *newPageNumber)
{
    if (this->pageNumber) //if something already in pageNumber, delete it
        delete [] this->pageNumber;
    this->pageNumber = new char[strlen(newPageNumber)+1];
    if (strcpy(this->pageNumber,newPageNumber))
        return true;
    else
        return false;
}


bool Postludes::Node::editPhysicalDescription (char *newPhysicalDescription)
{
    if (this->physicalDescription) //if something already in physicalDescription, delete it
        delete [] this->physicalDescription;
    this->physicalDescription = new char[strlen(newPhysicalDescription)+1];
    if (strcpy(this->physicalDescription,newPhysicalDescription))
        return true;
    else
        return false;
}


bool Postludes::Node::editDateMOD(char *newDateMOD)
{
    if (dateMOD) //if something already in dateMOD, delete it
        delete [] this->dateMOD;
    this->dateMOD = new char[strlen(newDateMOD)+1];
    if (strcpy(this->dateMOD,newDateMOD))
        return true;
    else
        return false;
}


void Postludes::Node::displaySingleSongAllInfo(Node *current)
{
    cout << current->songTitle << endl;
    cout << "    Composer: " << current->composer << endl;
    cout << "    Year Composed: " << current->yearComposed << endl;
    cout << "    Book Title: " << current->bookTitle << endl;
    cout << "    Page Number: " << current->pageNumber << endl;
    cout << "    Physical Description: " << current->physicalDescription << endl;
    cout << "    Last Changed: " << current->dateMOD << endl;
}



//overload friend << operator
//OUTPUT: out (which includes all info)
std::ostream& operator<<(std::ostream& out, Postludes& songList)
{
    Postludes::Node *temp = songList.head;
    while (temp != nullptr)
    {
        out << temp->songTitle << endl;
        out << "    Composer: " << temp->composer << endl;
        out << "    Year Composed: " << temp->yearComposed << endl;
        out << "    Book Title: " << temp->bookTitle << endl;
        out << "    Page Number: " << temp->pageNumber << endl;
        out << "    Physical Description: " << temp->physicalDescription << endl;
        out << "    Last Changed: " << temp->dateMOD << endl;
        temp = temp->next;
    }
    cout << endl;
    return out;
}


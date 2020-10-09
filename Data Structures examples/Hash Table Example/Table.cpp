
#include "Table.h"
const int MAX_CHAR = 1000;



//Default Constructor
//INPUT: nothing
//OUTPUT: nothing
Table::Table()
{
        size = 0;
        currCapacity = INIT_CAP;
        aTable = new Node*[currCapacity];
        for(int i=0; i<currCapacity; i++)
        {
                aTable[i] = nullptr;
        }
}



//Copy Constructor
//INPUT: Table object
//OUTPUT:nothing
Table::Table(const Table& aTable)
{
        *this = aTable;
}



//Default destructor
//INPUT: nothing
//OUTPUT: nothing
Table::~Table()
{
        destroy();
        delete [] aTable;
}



//Destroys all items in Table and table's chains
//INPUT: nothing
//OUTPUT: nothing
void Table::destroy()
{
        for(int i=0; i<currCapacity; i++)
        {
            if (aTable[i] != nullptr)
                destroyChain(aTable[i]);
        }
}



//Destroys chains at current table[index] position
//INPUT: Node pointer to specific spot
//OUTPUT: nothing
void Table::destroyChain(Node *currHead)
{
    Node *current = currHead;
    Node *temp = nullptr;
    while (current != nullptr)
    {
        temp = current->next;
        delete current;
        current = temp;
    }
}



//Adds a item to our Table
//INPUT: new SavedWebsites item
//OUTPUT: nothing
void Table::add(const SavedWebsites& parm)
{
        Node *newNode = new Node(parm); 
        int index = calculateIndex(newNode->data->getTopic()); //calculates where in table to index

        if (aTable[index] == nullptr)//nothing at index currently
        {
            aTable[index] = newNode;
            newNode->next = nullptr;
        }
        else
        {
            Node *current = aTable[index];
            while (current->next != nullptr)
            {
                current = current->next;
            }
            //once at end of linked list at index, add newNode
            current->next = newNode;
            newNode->next = nullptr;
        }
        size++;
}



//Removes a website and it's information from the table 
//INPUT: Table item
//OUTPUT: true if at least one item is removed
bool Table::removeWebsite(Table& parm)
{
    bool flag = false; //flag to show if an item is removed or not
    int OriTableSize = currCapacity;
    
    for (int index = 0; index < OriTableSize; index++) //search through array list, starting at index
    {
        Node *current = parm.aTable[index]; 
        Node *prev = nullptr;
        while (current != nullptr) //search through linked lists at array[index]
        {
            bool del = false; //flag if we want to delete a website or not
            if (current->data->getRating() == 1) //search ratings for 1
            {
                if (prev == nullptr) //if current is the start of the list
                {
                    if (current->next == nullptr) //if current is the only item in this list
                    {
                        parm.aTable[index] = nullptr;
                    }
                    else
                    {
                        parm.aTable[index] = current->next; //point to the next item in list
                    }
                    del = true;
                    flag = true;
                }
                else //reset prev->next pointer to skip current
                {
                    prev->next = current->next;
                    del = true;
                    flag = true;
                }
            }
            if (del) //if we have a node to delete
            {
                Node *deletenode = current;
                current = current->next;
                delete deletenode;
                size--;
            }
            else
            {
                prev = current;
                current = current->next; //go to next position in linked list
            }
        }
    }

    if (flag == true)//at least one item was removed
        return true;
    else
        return false;
}



//Searches through table to see if anything matches user's keyword 
//I'm using the hash function to get the starting point of our search, as exercise
//INPUT: topic keyword from user, Table we are searching, max number of items in the table to search
//OUTPUT: True if keyword match is found, false if no match
bool Table::retrieve(char *topic_keyword, const Table& parm) const
{
    int counter = 0; //reset numFound;
    int start = calculateIndex(topic_keyword); //put keyword through hash function
    int outsideCounter = 0; //counter for our outer loop
    
    for (int index = start; outsideCounter < currCapacity; outsideCounter++) //start the search at the hash function number produced
    {
        if (index == currCapacity) //once index gets to end of array, start over to search beginning section
        {
            index = 0;
        }
        
        Node *current = parm.aTable[index];
        
        while (current != nullptr) //search through linked lists at array[index]
        {
            const char *temp;
            temp = strstr(current->data->getTopic(), topic_keyword); //search topics for keyword (returns nullptr if no match)
            if (temp != nullptr)
            {
                current->data->display(); //if found, prints out website address
                cout << endl;
                counter++;
            }
            current = current->next; //go to next position in linked list
        }
        index++;
    }
    
    
    if (counter >= 1) //if search found at least one match, return true
    {
        return true;
    }
    else //else no matches, return false
        return false;
}



//Displays table's websites, numbered
//INPUT: Table we are searching
//OUTPUT: displays all of table's websites with numbers
void Table::displayWithNumbers(Table& parm)
{
    int counter = 1;
    for (int i = 0; i < currCapacity; i++) //iterate through array until at end
    {
        Node * current = parm.aTable[i];
        while (current != nullptr) //iterate through linked list if items are present
        {
            cout << counter << ". ";
            current->data->display(); //prints out website address
            cout << endl;
            current = current->next;
            counter++;
        }
    }
}



//Edits the review and rating part of a specific item in the table 
//INPUT: Table we are using, user number of which item to edit, new rating number (between 1 and 5), new cstring review 
//OUTPUT: True if edited successfully
bool Table::editReview(Table& parm, int userNumber, int newRating, char *newReview)
{
//get to spot specified by user
    int index = 0;
    int counter = 1;
    while (counter <= currCapacity)
    {
        Node * current = parm.aTable[index];
        while (current != nullptr) //iterate through linked list if items are present
        {
            if (counter < userNumber)
            {
                current = current->next;
                counter++; 
            }
            else //found position, edit info, then return
            {
                if (current->data->editReview(newReview) == false)
                    return false;
                if (current->data->editRating(newRating) == false)
                    return false;
                else
                    return true;
            }
        }
            index++;
    }
    return false;
}



//Displays specific item in table user is editing 
//INPUT: Table we are editing, number of which item user wants to edit 
//OUTPUT: displays item website name
void Table::youAreEditing(const Table& parm, int userNumber) const
{
    int index = 0;
    int counter = 1;
    while (counter <= currCapacity)
    {
        Node * current = parm.aTable[index];
        while (current != nullptr) //iterate through linked list if items are present
        {
            if (counter < userNumber)
            {
                current = current->next;
                counter++; 
            }
            else //found position, edit info, then return
            {
                current->data->display();
                return;
            }
        }
            index++;
    }
}




//Gets the current size of the number of items in the table 
//INPUT: nothing
//OUTPUT: integer for number of items in table 
int Table::getSize() const
{
    return size;
}



//Hash function calculates where in the table to store an item 
//INPUT: cstring key from user 
//OUTPUT: integer number of where in table to store new item
int Table::calculateIndex(const char *key) const
{
    int length = strlen(key);
    return length % currCapacity;
}



//overloaded << operator
//INPUT: ostream out and table to display 
//OUTPUT: displays all table items
ostream& operator<< (ostream& out, const Table& parm)
{
        for(int i=0; i<parm.currCapacity; i++)
        {
                parm.displayAll(out, parm.aTable[i]);
        }
        return out;
}



//**recursive
//displays all current chain node items (not entire table, just items at specific chain)
//INPUT: ostream out and current node 
//OUTPUT: displays current table position's chain's data 
void Table::displayAll(ostream& out, Node *current) const
{
        if(current)
        {
                out << *(current->data) << endl;
                displayAll(out, current->next);
        }
}



//loads information from data file into a table 
//INPUT: data file name 
//OUTPUT: nothing
void Table::loadFromFile(const char *fileName)
{
        ifstream in;
        SavedWebsites parm;
        char topic[MAX_CHAR];
        char website[MAX_CHAR];
        char summary[MAX_CHAR];
        char review[MAX_CHAR];
        int rating;

        in.open(fileName);
        if(!in)
        {
                cout << "Failed to open " << fileName << endl;
                exit(1);
        }

        while(!in.eof())
        {
                parm.clearAll();
                in.get(topic, MAX_CHAR, ';');
                in.get();
                in.get(website, MAX_CHAR, ';');
                in.get();
                in.get(summary, MAX_CHAR, ';');
                in.get();
                in.get(review, MAX_CHAR, ';');
                in.get();
                in >> rating;
                in.get();
                
                parm.setTopic(topic);
                parm.setWebsite(website);
                parm.setSummary(summary);
                parm.setReview(review);
                parm.setRating(rating);
                add(parm); //add all the new information to our table
                if (in.peek() == '^') //using as an EOF indicator
                {
                    in.close();
                    return;
                }
        }
        in.close();
}


                                          

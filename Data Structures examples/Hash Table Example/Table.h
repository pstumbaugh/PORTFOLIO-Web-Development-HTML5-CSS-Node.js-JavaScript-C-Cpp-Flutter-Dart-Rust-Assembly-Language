#ifndef TABLE_H
#define TABLE_H
#include "SavedWebsites.h"
#include <fstream>

class Table
{
public:
        Table();//Default Constructor
        Table(const Table& aTable);//Copy Constructor
        ~Table();//Default destructor
        void destroy();//Destroys all items in Table and table's chains
        
        void add(const SavedWebsites& parm);//Adds a item to our Table
        bool removeWebsite(Table& parm);//Removes a website and it's information from the table 
        bool retrieve(char *topic_keyword, const Table& parm) const;//Searches through table to see if anything matches user's keyword 
        void displayWithNumbers(Table& parm);//Displays table's websites, numbered
        bool editReview(Table& parm, int userNumber, int newRating, char *newReview);//Edits the review and rating part of a specific item in the table 
        void youAreEditing(const Table& parm, int userNumber) const;//Displays specific item in table user is editing 
        void display();//Hash function calculates where in the table to store an item 
        int getSize() const;//Gets the current size of the number of items in the table 

        friend ostream& operator<< (ostream& out, const Table& parm);

        void loadFromFile(const char * fileName);

private:
        struct Node
        {
                Node(const SavedWebsites& parm)
                {
                        data = new SavedWebsites(parm);
                        next = nullptr;
                };
                ~Node()
                {
                    delete data;
                    next = nullptr;
                }

                SavedWebsites *data;
                Node *next;
        };
        
        Node **aTable;
        const static int INIT_CAP = 17;
        int currCapacity;
        int size;

        int calculateIndex(const char * key) const;//Hash function calculates where in the table to store an item 
        void displayAll(ostream& out, Node * currHead) const;//**RECURSIVE** displays all current chain node items (not entire table, just items at specific chain)
        void destroyChain(Node *currHead);//Destroys chains at current table[index] position

    
};

#endif

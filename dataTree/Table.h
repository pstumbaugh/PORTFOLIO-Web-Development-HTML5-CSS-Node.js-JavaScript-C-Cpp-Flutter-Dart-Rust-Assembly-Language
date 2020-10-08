#ifndef TABLE_H
#define TABLE_H
#include "Websites.h"
#include <iostream>
#include <fstream>

using namespace std;

class Table
{
public:
    Table(); //Default Constructor
    Table(const Table& aTable); //Copy Constructor
    ~Table(); //Default Destructor

    void add(const Websites& parm);//Adds a Website object to our tree at appropriate location
    Websites *retrieve(const char *key);//Searches for first occurance of a keyword, returns that information
    int getSize() const;//Gets the current size of the number of items in the table 
    void displayAll() const;//displays all the websites, sorted by keyword
    bool remove(const char * key);//Removes an item from our table (tree)
    bool removeAll(const char * key);//Removes all instances of an item with matching keyword(s) from tree
    void loadFromFile(const char *fileName);//loads information from data file into a table (tree)

    const Table& operator= (const Table& aTable);//Overloaded = operator. Copies Table to new Table 
    friend ostream& operator<< (ostream& out, const Table& aTable);//Overloaded << operator. Displays the entire tree 


private:
    struct Node
    {
            Node(const Websites& parm)
            {
                    data = new Websites(parm);
                    left = right = nullptr;
            };

            Websites *data;
            Node *left;
            Node *right;
    };
    Node *root;
    int size; //number of items in our tree

    void add(Node *& currRoot, const Websites& parm);//HELPER: Adds a Website object to our tree at appropriate location
    Websites *retrieve(Node *&currRoot, const char *key);//HELPER FUNTION - Searches for first occurance of a keyword, returns that information
    void copy(Node * srcRoot, Node *& destRoot);//Copies a node from one spot to another
    bool remove(Node *& currRoot, const char * key);//HELPER - removes an item from our table (tree)
    bool removeAll(Node *& currRoot, const char * key);//HELPER - Removes all instances of an item with matching keyword(s) from tree
    void deleteNode(Node *& target);//Function to delete the node (after node to be deleted was found in remove() function)
    void displayInOrder(Node * currRoot) const;//HELPER - displays all items in a tree
    void destroy(Node *& currRoot); //Destroys tree data

};

#endif

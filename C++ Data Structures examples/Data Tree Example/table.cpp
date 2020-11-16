#include "Table.h"


//Default Constructor
Table::Table()
{
    root = nullptr;
    size = 0;
}



//Copy Constructor
//INPUT: Table object
//OUTPUT: copies table to this
Table::Table(const Table& aTable)
{
    root = nullptr;
    size = 0;
    *this = aTable;
}



//Default Destructor
Table::~Table()
{
    destroy(root);
}



//Destroys tree data
//INPUT: root of tree to destory (Node)
//OUTPUT: nothing (tree destroyed)
void Table::destroy(Node *& currRoot)
{
        if(currRoot)
        {
                destroy(currRoot->left);
                destroy(currRoot->right);
                delete currRoot->data;
                delete currRoot;
                currRoot = nullptr;
        }
}



//Adds a Website object to our tree at appropriate location
//INPUT: Website parm
//OUTPUT: nothing
void Table::add(const Websites& parm)
{
        add(this->root, parm);
        size++;
}



//HELPER: Adds a Website object to our tree at appropriate location
//INPUT: current root node and Websites object to add 
//OUTPUT: nothing
void Table::add(Node *&currRoot, const Websites &parm)
{
        if(!currRoot) //no current root (empty position)
        {
                currRoot = new Node(parm);
        }
        else if(parm < *(currRoot->data)) //compares topic
        {
                add(currRoot->left, parm);
        }
        else
        {
                add(currRoot->right, parm);
        }
}



//Searches for first occurance of a keyword, returns that information
//INPUT: char pointer key (keyword to search for)
//OUTPUT: Websites nullptr if nothing is found, Websites data if found
Websites *Table::retrieve(const char *key)
{
    return retrieve(this->root, key);
}



//HELPER - Searches for first occurance of a keyword, returns that information
//INPUT: char pointer key (keyword to search for) and current root
//OUTPUT: nullptr if nothing is found, Website data if found
Websites *Table::retrieve(Node *&currRoot, const char *key)
{
    if (currRoot == nullptr)
    {
        Websites *empty;
        empty = nullptr;
        return empty;
    }
    const char *temp = strstr(currRoot->data->getKeyword(), key);
    if (temp != nullptr)
        return currRoot->data;

    Websites *temp2 = retrieve(currRoot->left, key);
    if (temp2 != nullptr)
        return temp2;
        
    Websites *temp3 = retrieve(currRoot->right, key);
    if (temp3 != nullptr)
        return temp3;
    return nullptr;
}



//Gets the current size of the number of items in the table 
//INPUT: nothing
//OUTPUT: integer for number of items in table 
int Table::getSize() const
{
    return size;
}




//Copies a node from one spot to another
//INPUT: source Node and destination Node 
//OUTPUT: nothing
void Table::copy(Node * srcRoot, Node *& destRoot)
{
        if(srcRoot)
        {
                destRoot = new Node(*(srcRoot->data));
                copy(srcRoot->left, destRoot->left);
                copy(srcRoot->right, destRoot->right);
        }
        else
        {
                destRoot = nullptr;
        }
}

    

//displays all the items in the calling table (tree)
//INPUT: nothing
//OUTPUT: displays all items
void Table::displayAll() const
{
    displayInOrder(this->root);
}



//HELPER - displays all items in a tree
//INPUT: Node root
//OUTPUT: displays all items
void Table::displayInOrder(Node * currRoot) const
{
        if(currRoot)
        {
                displayInOrder(currRoot->left);
                cout << *(currRoot->data) << endl;
                displayInOrder(currRoot->right);
        }
}



//Removes an item from our table (tree)
//INPUT: char pointer with keyword to search for 
//OUTPUT: true if item removed, false if no item removed
bool Table::remove(const char * key)
{
        return remove(this->root, key);
}



//HELPER - removes an item from our table (tree)
//INPUT: current Node root, char pointer with keyword 
//OUTPUT: true if item removed, false if nothing found/removed
bool Table::remove(Node *& currRoot, const char * key)
{
    if (currRoot == nullptr) //end of branch, nothing found
    {
        return false;
    }
    //checks if key is in the item's keyword(s)
    //strstr returns nullptr if nothing found in keyword 
    const char *temp = strstr(currRoot->data->getKeyword(), key);
    if (temp != nullptr) //keyword found, delete that node and return true
    {
        deleteNode(currRoot);
        size--;
        return true;
    }
    if (remove(currRoot->left, key) == true) //move down left side searching
        return true;
    else if (remove(currRoot->right, key) == true) //move down right side searching
        return true;
    else
        return false;
}



//Removes all instances of an item with matching keyword(s) from tree
//INPUT: char pointer with keyword to search for 
//OUTPUT: true if item(s) removed, false if no item removed
bool Table::removeAll(const char * key)
{
        bool flag = removeAll(this->root, key);
        if (flag == true)
            this->removeAll(key); //call itself again if something is removed, to start the process over and not miss anything
        return flag;
}



//HELPER - Removes all instances of an item with matching keyword(s) from tree
//INPUT: current Node root, char pointer with keyword 
//OUTPUT: true if item(s) removed, false if nothing found/removed
bool Table::removeAll(Node *& currRoot, const char * key)
{
    bool flag = false;
    if (currRoot == nullptr) //end of branch, nothing found
    {
        return flag;
    }
    
    if (removeAll(currRoot->left, key) == true) //move down left side searching
        flag = true;
    if (removeAll(currRoot->right, key) == true) //move down right side searching
        flag = true;
    
    //checks if key is in the item's keyword(s)
    //strstr returns nullptr if nothing found in keyword 
    const char *temp = strstr(currRoot->data->getKeyword(), key);
    if (temp != nullptr) //keyword found, delete that node and return true
    {
        Node *newRoot = nullptr;
        if (currRoot->left != nullptr)
            newRoot = currRoot->left;
        else if (currRoot->right != nullptr)
            newRoot = currRoot->right;
        deleteNode(currRoot);
        size--;
        flag = true;
        if (newRoot)
            removeAll(newRoot, key);
        return flag;
    }

    return flag;
}



//Function to delete the node (after node to be deleted was found in remove() function)
//INPUT: target Node 
//OUTPUT: nothing 
void Table::deleteNode(Node *& target)
{
        if (target == nullptr) //nothing in tree to delete
            return;
        //target is a leaf, don't have to move anything
        if(target->left == nullptr && target->right == nullptr)
        {
                delete target->data;
                delete target;
                target = nullptr;
        }
        //target has just one child, left side
        else if(target->right == nullptr)
        {
                Node * temp = target;
                target = target->left;
                delete temp->data;
                delete temp;
                temp = nullptr;
        }
        //target has just one child, right side
        else if(target->left == nullptr)
        {
                Node * temp = target;
                target = target->right;
                delete temp->data;
                delete temp;
                temp = nullptr;
        }
        else //target node has two children
        {
                //get to successor
                Node * prev = nullptr;
                Node * curr = target->right; //start with the right child
                if(curr->left == nullptr) //only has right child
                {
                        target->right = curr->right;
                }
                else
                {
                        while(curr->left != nullptr) //traverse all the way down left side
                        {
                                prev = curr;
                                curr = curr->left;
                        }
                        prev->left = curr->right;
                }
                delete target->data;
                target->data = curr->data;
                delete curr;
                curr = nullptr;
                return;
        }
}
  
  
  

    
    
//Overloaded = operator. Copies Table to new Table 
//INPUT: source Table object
//OUTPUT: new Table
const Table& Table::operator= (const Table& tableSrc)
{
        if(this == &tableSrc)
                return *this;
        if(this->root)
        {
                destroy(this->root);
        }
        size = tableSrc.size;
        copy(tableSrc.root, this->root);
        return *this;
}



//Overloaded << operator. Displays the entire tree 
//INPUT: soureTable to Display
//OUTPUT: Displays all items of the table 
ostream& operator<< (ostream& out, const Table& srcTable)
{
        out << endl << "Displaying your tree:" << endl;
        srcTable.displayAll();
        return out;
}



//loads information from data file into a table 
//INPUT: data file name 
//OUTPUT: nothing
void Table::loadFromFile(const char *fileName)
{
    int MAX_CHAR = 1000;
    ifstream in;
    Websites parm;
    char topic[MAX_CHAR];
    char website[MAX_CHAR];
    char keyword[MAX_CHAR];
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
        in.get(keyword, MAX_CHAR, ';');
        in.get();
        in.get(summary, MAX_CHAR, ';');
        in.get();
        in.get(review, MAX_CHAR, ';');
        in.get();
        in >> rating;
        in.get();
    //load items into Websites ADT
        parm.setTopic(topic);
        parm.setWebsite(website);
        parm.setKeyword(keyword);
        parm.setSummary(summary);
        parm.setReview(review);
        parm.setRating(rating);
    //Add our Websites ADT to our Table (Tree)
        add(parm);
        if (in.peek() == '^') //using as an EOF indicator
        {
            in.close();
            return;
        }
    }
    in.close();
}

#include "Queue.h"


//Default Constructor
//INPUT: nothing
//OUTPUT: nothing
Queue::Queue()
{
    head = nullptr;
    rear = nullptr;
}



//Default Destructor
//INPUT: nothing
//OUTPUT: nothing
Queue::~Queue()
{
    Node *current = head;
    while (current)
    {
        head = current->next;
        delete current->data;
        delete current;
        current = head;
    }
    rear = nullptr;
}



//Adds a guest's information to the queue 
//INPUT: Guest parm pointer
//OUTPUT: nothing
void Queue::enqueue(Guest &parm) //add to back of line
{
    if (head == nullptr) //if nothing in list yet
    {
        Node *newNode = new Node();
        newNode->data = new Guest(parm);
        head = newNode;
        rear = newNode;
        return;
    }
    
    Node *temp = rear;
    Node *newNode = new Node();
    newNode->data = new Guest(parm);
    rear = newNode;
    temp->next = newNode;
    rear->next = head; //circular linked list
    
    return;
    
}



//Removes the next guest in line from the line 
//INPUT: nothing
//OUTPUT: false if queue is empty, true if guest is removed
bool Queue::dequeue() //remove from front of line
{
    if (isEmpty() == true) //if list is empty, do nothing
        return false;

    Node *current = head;
    
    if (head == rear) //if only one item in list
    {
        delete current->data;
        delete current;
        head = nullptr;
        rear = nullptr;
        return true;
    }
    
    //move head to next position and delete current position from list
    Node *temp = current->next;
    head = temp;
    delete current->data;
    delete current;
    rear->next = head; //repoint rear
    return true;
}



//Checks to see who's next in line 
//INPUT: nothing
//OUTPUT: name of next guest
char *Queue::peek() const
{
    Node *current = head;
    return current->data->getGroupName();
}



//Displays next group's name, then removes them from our queue list
//INPUT: nothing
//OUTPUT: nothing
bool Queue::getNext() const
{
    if (isEmpty() == true) //nobody in list
        return false;
    return true;
}



//Goes through list, displays all group names in order
//INPUT: nothing
//OUTPUT: nothing
void Queue::display() const
{
    int counter = 1;
    Node *current = head;
    if (current == nullptr) //nothing in the queue 
        return;

    cout << counter << ": " << current->data->getGroupName() << endl; //print first out
    if (current == rear) //only one item in list
        return;
    
    current = current->next;
    counter++;
    
    while (current != head) //once it wraps around to the front of the list, stop
    {
        cout << counter << ": " << current->data->getGroupName() << endl;
        current = current->next;
        counter++;
    } 
    
    return;
}



//Checks to see if queue is empty
//INPUT: nothing
//OUTPUT: true if empty, false otherwise
bool Queue::isEmpty() const
{
    if (head == nullptr) //list is empty 
        return true;
    else
        return false;
    
}
      
     
     
//Overloaded = operator - sets all needed information to what is being passed by parm
//INPUT: Node address parm
//OUTPUT: pointer to this
const Queue::Node &Queue::Node::operator = (const Queue::Node& parm)
{
    if (this == &parm) //if already same info
        return *this;
    this->data->setGroupName(parm.data->getGroupName());
    this->data->setNumberOfPeople(parm.data->getNumberofPeople());
    if (parm.data->getWheelChair() == true)
        this->data->setWheelChair();
    if (parm.data->getHighChair() == true)
        this->data->setHighChair();
    return *this;
}



//Outputs the next guest's information
//INPUT Queue parm 
//OUTPUT out (with guest info)
ostream & operator << (ostream& out, const Queue &parm)
{
    Queue::Node *temp = parm.head;
    out << "Group: " << temp->data->getGroupName() << endl;
    out << "Number of people: " << temp->data->getNumberofPeople() << endl;
    if (temp->data->getWheelChair() == true)
        out << "Wheelchair requested" << endl;
    if (temp->data->getHighChair() == true)
        out << "Highchair requested";
    cout << endl;
    return out;
}
        


        
        
        
        

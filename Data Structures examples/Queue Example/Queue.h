#ifndef QUEUE_H
#define QUEUE_H

#include <iostream>
#include "Guest.h"
using namespace std;

class Queue
{
public:
        Queue();//Default Constructor
        ~Queue();//Default Destructor
        void enqueue(Guest &parm);//Adds a guest's information to the queue 
        bool dequeue();//Removes the next guest in line from the line 
        char *peek() const;//Checks to see who's next in line 
        bool getNext() const;//Displays next group's name, then removes them from our queue list
        void display() const;//Goes through list, displays all group names in order
        bool isEmpty() const;//Checks to see if queue is empty
        
        friend ostream & operator << (ostream& out, const Queue& parm);


private:
    struct Node
    {
            Node()
            {
                data = nullptr;
                next = nullptr;
            }
            ~Node()
            {
                data = nullptr;
                next = nullptr;
            }
            
            Guest *data;
            Node *next;
            
            //Node overloaded functions
            const Node & operator = (const Node& parm);
            friend ostream & operator << (ostream& out, const Node& parm);
    };
    
    Node *head; //front of queue
    Node *rear; //back of line
};

#endif

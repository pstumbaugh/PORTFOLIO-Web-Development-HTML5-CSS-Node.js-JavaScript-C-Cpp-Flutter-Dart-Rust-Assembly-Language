#ifndef STACK_H
#define STACK_H

#include <iostream>
#include "Guest.h"
using namespace std;

class Stack
{
public:
        Stack();//Default Constructor
        Stack(const Stack &parm);//Copy Constructor
        ~Stack();//Default Destructor (calls destroy() function)

        void push(Guest &parm);//Pushes the new guest information to the top of the Stack
        void expand();//Expands the array of the stack by 1 position (called if stack becomes too large for initial array size)
        void pop();//Discards top item of the stack 
        void popAll(); //RECURSIVE FUNCTION //Pops all the items in our stack, blanking it out to 0
        bool peek() const;//returns the next element
        bool display();//Displays all elements of the stack 
        bool isEmpty() const;//Checks if current stack is empty or not
        
        void saveToFile(const char *fileName) const;//Saves the stack of guests (name and email) to the file CouponsList.txt
        const Stack & operator = (const Stack &parm);
        friend ostream& operator<< (ostream& out, const Stack& aStack);

private:
    void destroy();//Destroys current stack 
    Guest **myStack;
    const static int INIT_CAP = 1; //initial array capacity (calls expand() if needing to grow
    const static int GROWTH = 1; //growth rate - only expand the array by one position
    int currentCapacity; //keeps track of the size of the stack array 
    int top; //keeps track of the top item of the stack
};

#endif

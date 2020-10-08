#include "Stack.h"
#include <fstream>

//Default Constructor
//INPUT: nothing
//OUTPUT: nothing
Stack::Stack()
{
    top = 0;
    currentCapacity = INIT_CAP;
    myStack = new Guest*[currentCapacity];
    for (int i = 0; i < currentCapacity; i++)
    {
        myStack[i] = nullptr;
    }
}



//Copy Constructor
//INPUT: Stack address parm
//OUTPUT: nothing
Stack::Stack(const Stack &parm)
{
    *this = parm;
}



//Default Destructor (calls destroy() function)
//INPUT: nothing
//OUTPUT: nothing
Stack::~Stack()
{
    destroy();
}



//Destroys current stack 
//INPUT: nothing 
//OUTPUT: nothing
void Stack::destroy()
{
    for (int i = 0; i < top; i++) //delete all array elements in myStack
    {
        if (myStack[i])
            delete myStack[i];
    }
    if (myStack) //delete myStack array
        delete [] myStack;
}



//Pushes the new guest information to the top of the Stack
//INPUT: Guest address parm 
//OUTPUT: nothing
void Stack::push(Guest &parm)
{
    if (currentCapacity == top) //if out of room in capacity...
    {
        expand(); //...expand our array larger
    }
    myStack[top] = new Guest(); 
    myStack[top]->setName(parm.getName());
    myStack[top]->setEmail(parm.getEmail());
    top++;
    return;
}



//Expands the array of the stack by 1 position (called if stack becomes too large for initial array size)
//INPUT: nothing
//OUTPUT: nothing (stack array becomes larger)
void Stack::expand()
{
    currentCapacity += GROWTH; //add to our currentCapacity
    Guest **tempStack = new Guest *[currentCapacity]; //new stack with updated capacity 
    for (int i = 0; i < top; i++) //go through and reassign pointers to tempStack
    {
        tempStack[i] = myStack[i]; //just copying pointers
    }
    delete [] myStack; //delete old array
    myStack = tempStack; //reassign the temp array to myStack
}



//Discards top item of the stack 
//INPUT: nothing
//OUTPUT: nothing
void Stack::pop()
{
    if (isEmpty() == true)
        return;
    delete myStack[top-1];
    top--;
    return;
}



//RECURSIVE FUNCTION HERE
//Pops all the items in our stack, blanking it out to 0
//INPUT: nothing 
//OUTPUT: nothing
void Stack::popAll()
{
    if (this->isEmpty() == true) //if stack is empty, return
        return;
    this->pop(); //pops current item
    this->popAll(); //RECURSIVE: calls itself again
}



//returns the next element
//INPUT: Guest address parm
//OUTPUT: false if nothing to peek at, true if next item is available
bool Stack::peek() const
{
    if (isEmpty() == true)
        return false;
    else
        return true;
}



//Displays all elements of the stack 
//INPUT: nothing
//OUTPUT: displays stack elements
bool Stack::display()
{
    if (isEmpty() == true)//empty Stack
    {
        return false;
    }
    for (int i = (top-1); i >= 0; i--)
    {
        cout << myStack[i]->getName() << ": ";
        cout << myStack[i]->getEmail();
        cout << endl;
    }
    return true;
}



//Checks if current stack is empty or not
//INPUT: nothing
//OUTPUT: true if stack is empty
bool Stack::isEmpty() const
{
    if (top == 0)
        return true;
    else
        return false;
}



//Overloaded = operator
//INPUT: Stack parm address
//OUTPUT: this
const Stack &Stack::operator = (const Stack &parm)
{
    if (this == &parm) //if same thing already, return itself
        return *this;
    destroy(); //destroy current stack
    top = parm.top; 
    currentCapacity = parm.currentCapacity;
    myStack = new Guest*[currentCapacity]; //initialize new myStack
    for (int i = 0; i < top; i++)
    {
        myStack[i] = new Guest(*(parm.myStack[i]));
    }
    return *this;
}



//Overloaded << output 
//INPUT: out file and Stack &parm
//OUTPUT: displays all stack information
ostream & operator << (ostream &out, const Stack &parm)
{
    for (int i = 0; i < parm.top; i++)
    {
        out << parm.myStack[i]->getName() << "    ";
        out << parm.myStack[i]->getEmail() << endl;
    }
    return out;
}



//Saves the stack of guests (name and email) to the file CouponsList.txt
//INPUT: filename from user (preset to CouponsList.txt)
//OUTPUT: text saved to file CouponsList.txt
void Stack::saveToFile(const char *fileName) const
{
        ofstream out;

        out.open(fileName);
        if(!out)
        {
                cout << "Fail to open " << fileName << " for writing!" << endl;
                out.close();
        }

        for(int i=0; i<top; i++)
        {
                out << myStack[i]->getName() << ": " << myStack[i]->getEmail() << endl;
        }
        out.close();
}


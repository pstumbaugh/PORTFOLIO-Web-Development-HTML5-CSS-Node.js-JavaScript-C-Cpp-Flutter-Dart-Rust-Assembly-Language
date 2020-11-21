
#include "Guest.h"


//Default Constructor
//INPUT: nothing
//OUTPUT: nothing
Guest::Guest()
{
    clearAll(); //clearAll includes all defaults for Guest class
}



//Clears all the info in Guest to the original/null values
//INPUT: nothing
//OUTPUT: nothing
void Guest::clearAll()
{
    groupName = nullptr;
    wheelChair = false;
    highChair = false;
    name = nullptr;
    email = nullptr;
    coupons = false;
}


//Copy Constructor - takes parm and saves it to current data class
//INPUT: Guest pointer parm 
//OUTPUT: nothing
Guest::Guest(Guest *parm)
{
    setGroupName(parm->groupName);
    setNumberOfPeople(parm->numberOfPeople);
    if (parm->wheelChair == true)
        setWheelChair();
    if (parm->highChair == true)
        setHighChair();
    setName(parm->name);
    setEmail(parm->email);
}


//Default Destructor
//INPUT: nothing
//OUTPUT: nothing
Guest::~Guest()
{
    delete [] groupName;
    numberOfPeople = '\0';
    delete [] name;
    delete [] email;
}



//Sets a new group's name
//INPUT: pointer to new group name cstring
//OUTPUT: nothing
void Guest::setGroupName(const char *parm)
{
    if (this->groupName) //delete anything already in group name
    {
        delete [] this->groupName;
    }
    this->groupName = new char[strlen(parm)+1];
    strcpy(this->groupName, parm);
}



//Sets the new number of people in this group 
//INPUT: integer of number of people in group 
//OUTPUT: nothing
bool Guest::setNumberOfPeople(int parm)
{
    this->numberOfPeople = parm;
    return true;
}



//Sets wheelChair to true
//Input: boolean parm
//OUTPUT: nothing
void Guest::setWheelChair()
{
    this->wheelChair = true;
}



//Sets highChair to true
//INPUT: True or false parm
//OUTPUT: nothing
void Guest::setHighChair()
{
    this->highChair = true;
}



//Saves the name of the person making the reservration
//INPUT: cstring of new person's name 
//OUTPUT: true once successful
void Guest::setName(const char *parm)
{
    if (this->name) //delete anything already in group name
    {
        delete [] this->name;
    }
    this->name = new char[strlen(parm)+1];
    strcpy(this->name, parm);
}



//Sets the email address for person
//INPUT: cstring of new email
//OUTPUT: true once successful
void Guest::setEmail(const char *parm)
{
    if (this->email) //delete anything already in group name
    {
        delete [] this->email;
    }
    this->email = new char[strlen(parm)+1];
    strcpy(this->email, parm);
}



//Gets the group's name 
//INPUT: nothing
//OUTPUT: group's name 
char *Guest::getGroupName() const
{
    return groupName;
}



//Gets the number of people in a group 
//INPUT: nothing
//OUTPUT: number of people in group
int Guest::getNumberofPeople() const
{
    return numberOfPeople;
}



//Returns true if wheelchair is needed
//INPUT: nothing
//OUTPUT: true if wheelchair needed, false if not
bool Guest::getWheelChair() const
{
    return wheelChair;
}



//Returns true if highchair is needed
//INPUT: nothing
//OUTPUT: true or false if high chair is needed
bool Guest::getHighChair() const
{
    return highChair;
}



//Returns the name of the person making the reservation
//INPUT: nothing
//OUTPUT: name of person
char *Guest::getName() const
{
    return name;
}



//Returns the email address of the person making the reservation 
//INPUT: nothing
//OUTPUT: email
char *Guest::getEmail() const
{
    return email;
}



//Reassigns Guest information
//INPUT: new guest information
//OUTPUT: this
const Guest & Guest::operator = (const Guest &parm)
{
    if (this == &parm) //self assignment?
        return *this;
    setGroupName(parm.groupName);
    setNumberOfPeople(parm.numberOfPeople);
    if (parm.wheelChair == true)
        setWheelChair();
    if (parm.highChair == true)
        setHighChair();
    setName(parm.name);
    setEmail(parm.email);
    return *this;
}



//Displays all the guest information
//INPUT: ostream out and Guest information
//OUTPUT: displays guest information
ostream & operator << (ostream &out, const Guest &parm)
{
    out << "Group Name: " << parm.groupName << endl;
    out << "Size: " << parm.numberOfPeople << endl;
    if (parm.wheelChair == true)
        out << "Wheel Chair needed" << endl;
    if (parm.highChair == true)
        out << "High Chair needed" << endl;
    out << "Reservation made by: " << endl;
    out << "Email: " << parm.email << endl;
    return out;
}


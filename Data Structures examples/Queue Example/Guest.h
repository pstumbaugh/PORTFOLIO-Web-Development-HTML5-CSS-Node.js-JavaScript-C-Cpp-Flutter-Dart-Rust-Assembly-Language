#ifndef GUEST_H
#define GUEST_H

#include <iostream>
using namespace std;
#include <cstring>

class Guest
{
public:
    Guest();//Default Constructor
    void clearAll();//Clears all the info in Guest to the original/null values
    Guest(Guest *parm);//Copy Constructor
    ~Guest();//Default Destructor
    void setGroupName(const char *parm);//Sets a new group's name
    bool setNumberOfPeople(const int parm);//Sets the new number of people in this group 
    void setWheelChair();//Sets wheelChair to true
    void setHighChair();//Sets highChair to true
    void setName(const char *parm);//Saves the name of the person making the reservration
    void setEmail(const char *parm);//Sets the email address for person

    char *getGroupName() const;//Gets the group's name 
    int getNumberofPeople() const;//Gets the number of people in a group 
    bool getWheelChair() const;//Returns true if wheelchair is needed
    bool getHighChair() const;//Returns true if highchair is needed
    char *getName() const;//Returns the name of the person making the reservation
    char *getEmail()const;//Returns the email address of the person making the reservation 

    const Guest& operator= (const Guest& parm);
    friend ostream& operator<< (ostream& out, const Guest& parm);


private:
    char *groupName;
    int numberOfPeople;
    bool wheelChair;
    bool highChair;
    char *name;
    char *email;
    bool coupons;
};

#endif

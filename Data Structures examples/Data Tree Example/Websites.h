#ifndef WEBSITES_H
#define WEBSITES_H

#include <iostream>
using namespace std;
#include <cstring>

class Websites
{
public:
    Websites();//Default Constructor
    Websites(const Websites& parm);//Copy Constructor
    ~Websites();//Default Destructor
    void clearAll();//clears out all the items in SavedWebsites item

    const char * getTopic() const;//gets website topic
    const char * getWebsite() const;//gets the website
    const char * getKeyword() const;//gets the keyword 
    const char * getSummary() const;//gets the summary
    const char * getReview() const;//gets the review
    const int getRating() const;//gets the rating
    void setTopic(char *topic);//sets the topic
    void setWebsite(char *website);//sets the website
    void setKeyword(char *parm);//sets the keyword 
    void setSummary(char *summary);//sets the summary
    void setReview(char *review);//sets the review
    void setRating(int rating);//sets the rating
    
//overloaded operators:
    const Websites& operator= (const Websites& aStudent);//overloaded = operator
    friend ostream& operator<< (ostream& out, const Websites& aStudent);//Overloaded << operator 

private:
//variables of data
    char *topic;
    char *website;
    char *keyword;
    char *summary;
    char *review;
    int rating;
};

bool operator < (const Websites& web1, const Websites& web2);//Compares two Websites objects by keyword 

#endif

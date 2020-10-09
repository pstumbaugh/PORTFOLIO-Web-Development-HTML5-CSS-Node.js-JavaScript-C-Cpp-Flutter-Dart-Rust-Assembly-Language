
#include "Websites.h"



//Default Constructor
Websites::Websites()
{
    topic = nullptr;
    website = nullptr;
    keyword = nullptr;
    summary = nullptr;
    review = nullptr;
    rating = 0;
}



//Copy Constructor
//INPUT: Websites parm
//OUTPUT: nothing
Websites::Websites(const Websites& parm)
{
        *this = parm;
}



//Default Destructor
Websites::~Websites()
{
    clearAll();
}



//clears out all the items in Websites item
//INPUT: nothing
//OUTPUT: nothing
void Websites::clearAll()
{
    if (this->topic)
    {
        delete [] this->topic;
        this->topic = nullptr;
    }
    if (this->website)
    {
        delete [] this->website;
        this->website = nullptr;
    }
    if (this->keyword)
    {
        delete [] this->keyword;
        this->keyword = nullptr;
    }
    if (this->summary)
    {
        delete [] this->summary;
        this->summary = nullptr;
    }
    if (this->review)
    {
        delete [] this->review;
        this->review = nullptr;
    }
    rating = 0;

}



//gets website topic
//INPUT: nothing
//OUTPUT: cstring topic
const char * Websites::getTopic() const
{
    return topic;
}
        


//gets the website
//INPUT: nothing
//OUTPUT: cstring website
const char * Websites::getWebsite() const
{
    return website;
}



//gets the keyword
//INPUT: nothing
//OUTPUT: cstring keyword
const char * Websites::getKeyword() const
{
    return keyword;
}



//gets the summary 
//INPUT: nothing
//OUTPUT: cstring summary
const char * Websites::getSummary() const
{
    return summary;
}



//gets the review 
//INPUT: nothing
//OUTPUT: cstring review
const char * Websites::getReview() const
{
    return review;
}



//gets the rating 
//INPUT: nothing
//OUTPUT: integer rating 
const int Websites::getRating() const
{
    return rating;
}



//copies the topic into our ADT 
//INPUT: cstring topic
//OUTPUT: nothing
void Websites::setTopic(char *parm)
{
    topic = new char[strlen(parm)+1];
    strcpy(topic, parm);
    
}



//copies the website into our ADT 
//INPUT: cstring website
//OUTPUT: nothing
void Websites::setWebsite(char *parm)
{

    this->website = new char[strlen(parm)+1];
    strcpy(this->website, parm);
}



//copies the keyword into our ADT 
//INPUT: cstring keyword
//OUTPUT: nothing
void Websites::setKeyword(char *parm)
{

    this->keyword = new char[strlen(parm)+1];
    strcpy(this->keyword, parm);
}



//copies the summary into our ADT 
//INPUT: cstring summary
//OUTPUT: nothing
void Websites::setSummary(char *summary)
{

    this->summary = new char[strlen(summary)+1];
    strcpy(this->summary, summary);
    
}



//copies the review into our ADT 
//INPUT: cstring review
//OUTPUT: nothing
void Websites::setReview(char *parm)
{
    review = new char[strlen(parm)+1];
    strcpy(review, parm);
}



//copies the rating into our ADT 
//INPUT: integer rating
//OUTPUT: nothing
void Websites::setRating(int parm)
{
    this->rating = parm;
}



//overloaded = operator
//INPUT: Websites parm
//OUTPUT: nothing
const Websites& Websites::operator= (const Websites& parm)
{
        if(this == &parm)
        {
                return *this;
        }
        setTopic(parm.topic);
        setWebsite(parm.website);
        setKeyword(parm.keyword);
        setSummary(parm.summary);
        setReview(parm.review);
        setRating(parm.rating);

        return *this;
}



//Overloaded << operator 
//INPUT: ostream out and Websites parm
//OUTPUT: displays all info from Websites
ostream& operator<< (ostream& out, const Websites& parm)
{
        out << "TOPIC: " << parm.topic << endl;
        out << "WEBSITE: " << parm.website << endl;
        out << "KEYWORD: " << parm.keyword << endl;
        out << "SUMMARY: " << parm.summary << endl;
        out << "REVIEW: " << parm.review << endl;
        out << "RATING: " << parm.rating << endl;
        out << endl;
        return out;
}



//Compares two Websites objects by keyword 
//INPUT: two website objects
//OUTPUT: integer number. If str1 is less than str2, return true, otherwise return false
bool operator< (const Websites& web1, const Websites& web2)
{
    //compares keyword characters
    int compareResult = strcmp(web1.getKeyword(), web2.getKeyword());
    return compareResult < 0; //if compareResult is < 0, return true, else return false
}




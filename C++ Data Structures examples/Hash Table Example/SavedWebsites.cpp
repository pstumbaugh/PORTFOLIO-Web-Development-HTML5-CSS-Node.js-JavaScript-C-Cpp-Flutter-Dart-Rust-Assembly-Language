#include "SavedWebsites.h"



//Default Constructor
SavedWebsites::SavedWebsites()
{
    topic = nullptr;
    website = nullptr;
    summary = nullptr;
    review = nullptr;
    rating = 0;
}



//Copy Constructor
//INPUT: SavedWebsites parm
//OUTPUT: nothing
SavedWebsites::SavedWebsites(const SavedWebsites& parm)
{
        *this = parm;
}



//Default Destructor
SavedWebsites::~SavedWebsites()
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



//clears out all the items in SavedWebsites item
//INPUT: nothing
//OUTPUT: nothing
void SavedWebsites::clearAll()
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
const char * SavedWebsites::getTopic() const
{
    return topic;
}
        



//gets the website
//INPUT: nothing
//OUTPUT: cstring website
const char * SavedWebsites::getWebsite() const
{
    return website;
}



//gets the summary 
//INPUT: nothing
//OUTPUT: cstring summary
const char * SavedWebsites::getSummary() const
{
    return summary;
}



//gets the review 
//INPUT: nothing
//OUTPUT: cstring review
const char * SavedWebsites::getReview() const
{
    return review;
}



//gets the rating 
//INPUT: nothing
//OUTPUT: integer rating 
const int SavedWebsites::getRating() const
{
    return rating;
}



//copies the topic into our ADT 
//INPUT: cstring topic
//OUTPUT: nothing
void SavedWebsites::setTopic(char *parm)
{
    topic = new char[strlen(parm)+1];
    strcpy(topic, parm);
    
}



//copies the website into our ADT 
//INPUT: cstring website
//OUTPUT: nothing
void SavedWebsites::setWebsite(char *parm)
{

    this->website = new char[strlen(parm)+1];
    strcpy(this->website, parm);
}



//copies the summary into our ADT 
//INPUT: cstring summary
//OUTPUT: nothing
void SavedWebsites::setSummary(char *summary)
{

    this->summary = new char[strlen(summary)+1];
    strcpy(this->summary, summary);
    
}



//copies the review into our ADT 
//INPUT: cstring review
//OUTPUT: nothing
void SavedWebsites::setReview(char *parm)
{
    review = new char[strlen(parm)+1];
    strcpy(review, parm);
}



//copies the rating into our ADT 
//INPUT: integer rating
//OUTPUT: nothing
void SavedWebsites::setRating(int parm)
{
    this->rating = parm;
}



//edits the rating in our ADT 
//INPUT: integer rating
//OUTPUT: true if copy is successful
bool SavedWebsites::editRating(int newRating)
{
    if ((this->rating = newRating))
        return true;
    return false; //error if = doesn't work
}



//edits the review in our ADT 
//INPUT: cstring review
//OUTPUT: true if copy is successful
bool SavedWebsites::editReview(char *newReview)
{
    if(this->review)
        delete [] this->review;
    this->review = nullptr;
    this->review = new char[strlen(newReview)+1];
    if (strcpy(this->review, newReview))
        return true;
    return false; //return false if strcpy error
    
}



//displays the called website cstring
//INPUT: nothing
//OUTPUT: website info
void SavedWebsites::display()
{
    cout << "Website: " << getWebsite();
}



//overloaded = operator
//INPUT: SavedWebsites parm
//OUTPUT: nothing
const SavedWebsites& SavedWebsites::operator= (const SavedWebsites& parm)
{
        if(this == &parm)
        {
                return *this;
        }
        setTopic(parm.topic);
        setWebsite(parm.website);
        setSummary(parm.summary);
        setReview(parm.review);
        setRating(parm.rating);

        return *this;
}



//Overloaded << operator 
//INPUT: ostream out and SavedWebsites parm
//OUTPUT: displays all info from SavedWebsites
ostream& operator<< (ostream& out, const SavedWebsites& parm)
{
        out << "TOPIC: " << parm.topic << endl;
        out << "WEBSITE: " << parm.website << endl;
        out << "SUMMARY: " << parm.summary << endl;
        out << "REVIEW: " << parm.review << endl;
        out << "RATING: " << parm.rating << endl;
        out << endl;
        return out;
}



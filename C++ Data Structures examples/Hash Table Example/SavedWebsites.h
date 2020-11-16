#ifndef SAVEDWEBSITES_H
#define SAVEDWEBSITES_H

#include <iostream>
using namespace std;
#include <cstring>

class SavedWebsites
{
public:
        SavedWebsites();//Default Constructor
        SavedWebsites(const SavedWebsites& parm);//Copy Constructor
        ~SavedWebsites();//Default Destructor
        void clearAll();//clears out all the items in SavedWebsites item

        const char * getTopic() const;//gets website topic
        const char * getWebsite() const;//gets the website
        const char * getSummary() const;//gets the summary
        const char * getReview() const;//gets the review
        const int getRating() const;//gets the rating
        void setTopic(char *topic);//sets the topic
        void setWebsite(char *website);//sets the website
        void setSummary(char *summary);//sets the summary
        void setReview(char *review);//sets the review
        void setRating(int rating);//sets the rating
        bool editRating(int newRating);//edits the rating
        bool editReview(char *newReview);//edits the review
        
        void display();//displays the called website cstring
        
        const SavedWebsites& operator= (const SavedWebsites& parm);
        friend ostream& operator<< (ostream& out, const SavedWebsites& parm);

private:
        char *topic;
        char *website;
        char *summary;
        char *review;
        int rating;
};

#endif

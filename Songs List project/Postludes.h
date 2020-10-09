#pragma once
#include <iostream>
#include <fstream>
#include <cstring>
#include <string>
#include <iomanip>

using namespace std;

class Postludes
{
    public:
        Postludes();
        ~Postludes();
        void destroy();
        bool initialize();
        void saveToFile() const;
        
        void postludesMain(); //in mainPostludes.cpp
        
        bool addNewSong();
        bool addNewSongFromFile(char *newSongTitle, char *newComposer, 
            int newYearComposed, char *newBookTitle, char *newPageNumber, 
            char *newPhysicalDescription, char *newDateMOD);

        void displaySongTitles();
        void displaySongTitlesAndDateMOD();
        void dispalyAllInfoSpecificSong();
        void displayAllSongInfo();
        bool editSong();
        bool deleteSong();

        friend std::ostream& operator<<(std::ostream& out, Postludes& songList); //used to display entire list

    private:
        struct Node
        {
            Node()
            {
                songTitle = nullptr;
                composer = nullptr;
                bookTitle = nullptr;
                pageNumber = nullptr;
                physicalDescription = nullptr;
                dateMOD = nullptr;
                next = nullptr;
            }
            ~Node()
            {
                songTitle = nullptr;
                composer = nullptr;
                bookTitle = nullptr;
                pageNumber = nullptr;
                physicalDescription = nullptr;
                dateMOD = nullptr;
                next = nullptr;
            }
            char *songTitle;
            char *composer;
            int yearComposed;
            char *bookTitle;
            char *pageNumber;
            char *physicalDescription;
            char *dateMOD;
            
            Node *next;
            void displaySingleSongTitle();
            bool editSongTitle(char *newSongTitle);
            bool editComposer(char *newComposer);
            bool editYearComposed(int newYearComposed);
            bool editBookTitle (char *newBookTitle);
            bool editPageNumber (char *newPageNumber);
            bool editPhysicalDescription (char *newPhysicalDescription);
            bool editDateMOD(char *newDateMOD);
            void displaySingleSongAllInfo(Node *current);
        };
        Node *head;  
};

#pragma once
#include <iostream>
#include <fstream>
#include <cstring>
#include <string>
#include <iomanip>

using namespace std;

class FaithWeSing
{
    public:
        FaithWeSing();
        ~FaithWeSing();
        void destroy();
        bool initialize();
        void saveToFile() const;
        
        void faithWeSingMain(); //in mainFaithWeSing.cpp
        
        bool addNewSong();
        bool addNewSongFromFile(char *newSongTitle, char *newSongNumber, 
            char *newPageNumber, char *newDateMOD);

        void displaySongTitles();
        void displaySongTitlesAndDateMOD();
        void dispalyAllInfoSpecificSong();
        void displayAllSongInfo();
        bool editSong();
        bool deleteSong();

        friend std::ostream& operator<<(std::ostream& out, FaithWeSing& songList); //used to display entire list

    private:
        struct Node
        {
            Node()
            {
                songTitle = nullptr;
                songNumber = nullptr;
                pageNumber = nullptr;
                dateMOD = nullptr;
                next = nullptr;
            }
            ~Node()
            {
                songTitle = nullptr;
                songNumber = nullptr;
                pageNumber = nullptr;
                dateMOD = nullptr;
                next = nullptr;
            }
            char *songTitle;
            char *songNumber;
            char *pageNumber;
            char *dateMOD;
            
            Node *next;
            void displaySingleSongTitle();
            bool editSongTitle(char *newSongTitle);
            bool editSongNumber(char *newSongNumber);
            bool editPageNumber (char *newPageNumber);
            bool editDateMOD(char *newDateMOD);
            void displaySingleSongAllInfo(Node *current);
        };
        Node *head;  
};

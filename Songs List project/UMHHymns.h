#pragma once
#include <iostream>
#include <fstream>
#include <cstring>
#include <string>
#include <iomanip>

using namespace std;

class UMHHymns
{
    public:
        UMHHymns();
        ~UMHHymns();
        void destroy();
        bool initialize();
        void saveToFile() const;
        
        void umhHymnsMain(); //in mainUMHHymns.cpp
        
        bool addNewSong();
        bool addNewSongFromFile(char *newSongTitle, char *newHymnNumber, 
            char *newDateMOD);

        void displaySongTitles();
        void displaySongTitlesAndDateMOD();
        void dispalyAllInfoSpecificSong();
        void displayAllSongInfo();
        bool editSong();
        bool deleteSong();

        friend std::ostream& operator<<(std::ostream& out, UMHHymns& songList); //used to display entire list

    private:
        struct Node
        {
            Node()
            {
                songTitle = nullptr;
                hymnNumber = nullptr;;
                dateMOD = nullptr;
                next = nullptr;
            }
            ~Node()
            {
                songTitle = nullptr;
                hymnNumber = nullptr;
                dateMOD = nullptr;
                next = nullptr;
            }
            char *songTitle;
            char *hymnNumber;
            char *dateMOD;
            
            Node *next;
            void displaySingleSongTitle();
            bool editSongTitle(char *newSongTitle);
            bool editHymnNumber(char *newHymnNumber);
            bool editDateMOD(char *newDateMOD);
            void displaySingleSongAllInfo(Node *current);
        };
        Node *head;  
};

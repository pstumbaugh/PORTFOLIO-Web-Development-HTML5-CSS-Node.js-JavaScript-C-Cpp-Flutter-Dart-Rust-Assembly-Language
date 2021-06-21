# Patrick Stumbaugh
# Project 4 - Client/Server Chat

# some coding for socket setup section cited from https://www.geeksforgeeks.org/simple-chat-room-using-python/

# NOTE - Must use Python3.
# To start program, start the server.py program first.
# Once that is running and awaiting messages, start this client program by entering:
# python3 client.py
# The client program will send the first message

# --------CLIENT---------

import socket

# takes a message user is wanting to send, adds in the size and delimiter to front of message
def getMessage(messageToSend):
    size = len(messageToSend)
    message = str(size) + delim + messageToSend
    return message


# setup socket
clientSocket = socket.socket()
hostInformation = socket.gethostname()
ipAddress = socket.gethostbyname("localhost")
# if using something other than "localhost" for the host:
# hostInformation = socket.gethostname()
# ipAddress = socket.gethostbyname(hostInformation)

# port information - must match server port number
port = 6789

# connect to the port the server is using
clientSocket.connect(("", port))

delim = "~$"
errorFlag = False

# print info about connection:
print("Connected to localhost on port:", port)

# print user information needed:
print("Type /q to quit")
print("Enter message to send...")

while True:
    if errorFlag == False:
        # SEND A MESSAGE TO THE SERVER:
        messageToSend = input("> ")
        if messageToSend == "/q":  # if the client wants to close the chat
            message = getMessage(messageToSend)
            print(message)
            clientSocket.send(
                message.encode()
            )  # send the message so the server gets the close reequest too
            clientSocket.close()
            break
        else:
            message = getMessage(messageToSend)
            clientSocket.send(message.encode())

    # GET A MESSAGE FROM THE SERVER:
    messageReceived = clientSocket.recv(1024).decode()

    delimPosition = messageReceived.find(delim)
    receiveSize = messageReceived[:delimPosition]
    messageReceived = messageReceived[delimPosition + 2 :]

    if int(receiveSize) == 0:
        messageToSend = (
            "Sorry, there was an error or message was blank. Please try again."
        )
        size = len(messageToSend)
        message = str(size) + delim + messageToSend
        clientSocket.send(message.encode())
        errorFlag = True
    else:
        if messageReceived == "/q":  # if the client wants to close the chat
            clientSocket.close()
            break
        print("SERVER: ", messageReceived)
        errorFlag = False

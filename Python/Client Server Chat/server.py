# Patrick Stumbaugh
# Project 4 - Client/Server Chat

# some coding for socket setup section cited from https://www.geeksforgeeks.org/simple-chat-room-using-python/

# NOTE - Must use Python3.
# To start program, start this server first by entering in command line:
# python3 server.py
# The client program will send the first message

# --------SERVER---------

import socket


def getMessage(messageToSend):
    size = len(messageToSend)
    message = str(size) + delim + messageToSend
    return message


# setup socket
serverSocket = socket.socket()
ipAddress = socket.gethostbyname("localhost")
# if using something other than "localhost" for the host:
# hostInformation = socket.gethostname()
# ipAddress = socket.gethostbyname(hostInformation)

# port information - must match client port number
port = 6789
print("Server listening on localhost, port: %s" % port)

# set socket re-use option
serverSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# connect (bind) and listen for outside connections (only 1 allowed for this program)
serverSocket.bind(("", port))
serverSocket.listen(1)  # waits here until connection is requested

# new connection requested, accept the connection request
conn, connInfo = serverSocket.accept()
print("Connected by ", connInfo)

delim = "~$"

firstMessage = True
print("Waiting for message...")

while True:
    # GET MESSAGE FROM CLIENT:
    messageReceived = (conn.recv(1024)).decode()

    delimPosition = messageReceived.find(delim)
    receiveSize = messageReceived[:delimPosition]
    messageReceived = messageReceived[delimPosition + 2 :]

    if int(receiveSize) == 0:
        messageToSend = (
            "Sorry, there was an error or message was blank. Please try again."
        )

        size = len(messageToSend)
        message = str(size) + delim + messageToSend
        conn.send(message.encode())

    else:
        if messageReceived == "/q":  # if the client wants to close the chat
            serverSocket.close()
            break
        print("CLIENT: ", messageReceived)
        if firstMessage == True:  # prompts for first message from server back to client
            print("Type /q to quit")
            print("Enter message to send...")
            firstMessage = False

        # SEND A MESSAGE TO THE CLIENT:
        messageToSend = input("> ")
        if messageToSend == "/q":  # if the server wants to close the chat
            message = getMessage(messageToSend)
            conn.send(
                message.encode()
            )  # send the message so the client gets the close reequest too
            serverSocket.close()
            break
        else:
            message = getMessage(messageToSend)
            conn.send(message.encode())

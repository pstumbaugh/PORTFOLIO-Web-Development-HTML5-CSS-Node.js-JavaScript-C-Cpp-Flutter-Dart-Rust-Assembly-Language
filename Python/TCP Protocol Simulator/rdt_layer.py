from segment import Segment


# #################################################################################################################### #
# RDTLayer                                                                                                             #
#                                                                                                                      #
# Description:                                                                                                         #
# The reliable data transfer (RDT) layer is used as a communication layer to resolve issues over an unreliable         #
# channel.                                                                                                             #                                                                             #
#                                                                                                                      #
# #################################################################################################################### #


class RDTLayer(object):
    # ################################################################################################################ #
    # Class Scope Variables                                                                                            #
    #                                                                                                                  #                                                                                                   #
    #                                                                                                                  #
    # ################################################################################################################ #
    # in characters                     # The length of the string data that will be sent per packet...
    DATA_LENGTH = 4
    # in characters          # Receive window size for flow-control
    FLOW_CONTROL_WIN_SIZE = 15
    windowSize = -1
    sendChannel = None
    receiveChannel = None
    dataToSend = ""
    # Use this for segment 'timeouts'
    currentIteration = 0
    countSegmentTimeouts = 0
    seqnum = 0
    acknum = -1
    newData = ""  # holds new data for client/server
    storedData = ""
    receivedPackets = []
    totalCheckSum = 0
    # Add items as needed

    # ################################################################################################################ #
    # __init__()                                                                                                       #                                                                                         #
    #                                                                                                                  #
    # ################################################################################################################ #
    def __init__(self):
        self.sendChannel = None
        self.receiveChannel = None
        self.dataToSend = ""
        self.currentIteration = 0
        self.seqnum = 0
        self.newData = ""
        self.windowSize = 15

        # Add items as needed

    # ################################################################################################################ #
    # setSendChannel()                                                                                                 #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # Called by main to set the unreliable sending lower-layer channel                                                 #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    def setSendChannel(self, channel):
        self.sendChannel = channel

    # ################################################################################################################ #
    # setReceiveChannel()                                                                                              #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # Called by main to set the unreliable receiving lower-layer channel                                               #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    def setReceiveChannel(self, channel):
        self.receiveChannel = channel

    # ################################################################################################################ #
    # setDataToSend()                                                                                                  #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # Called by main to set the string data to send                                                                    #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    def setDataToSend(self, data):
        self.dataToSend = data

    # ################################################################################################################ #
    # getDataReceived()                                                                                                #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # Called by main to get the currently received and buffered string data, in order                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    def getDataReceived(self):
        # ############################################################################################################ #
        # Identify the data that has been received...

        print("getDataReceived():")
        segmentReceived = Segment()
        segmentReceived.setData(self.seqnum, self.newData)
        print("RECEIVED: ", segmentReceived.payload)
        # ############################################################################################################ #
        return self.newData

    # ################################################################################################################ #
    # processData()                                                                                                    #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # "timeslice". Called by main once per iteration                                                                   #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #

    def processData(self):
        self.currentIteration += 1
        self.processSend()
        self.processReceiveAndSendRespond()

    # ################################################################################################################ #
    # processSend()                                                                                                    #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # Manages Segment sending tasks                                                                                    #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    def processSend(self):

        self.windowSize = 15  # reset the window size (if first run)

        # get the returned message if there is one
        listIncomingSegments = self.receiveChannel.receiveQueue
        if len(listIncomingSegments) > 0:
            # set our open window size to send (uses the returnd ACK sequence number)
            self.windowSize = listIncomingSegments[0].seqnum
            # set our next sequence number to send as the returned acknum requested
            self.seqnum = listIncomingSegments[0].acknum
        elif self.currentIteration == 0:  # if first time, set seqnum to 0
            self.seqnum = 0
        # elif self.seqnum != -1 and self.seqnum != 0:
        # self.seqnum = self.seqnum - 4
        else:  # assume it's timed out, add one to our counter
            self.countSegmentTimeouts += 1

        segmentSend = Segment()

        print("processSend():")

        # if there is new data, save it in self.storedData
        if self.dataToSend != "":
            self.storedData = self.dataToSend

        # get the data (from storage) and store it in variable
        allData = self.storedData
        dataSize = len(allData)
        dataLength = RDTLayer.DATA_LENGTH  # length of the data we are going to send

        # if wanting the first segment, use:
        if self.seqnum == -1:
            self.seqnum = 0

        if dataSize == 0:
            return

        if self.seqnum > dataSize:
            return

        # while we have space in our window size to send things, loop:
        while self.windowSize >= 4:
            # reset our local variables
            checkSum = 0
            counter = 0
            data = ""

            # make a new Segment() object to send
            segmentSend = Segment()

            # add our segment of data
            while counter < 4:
                # if there is too much, break out of this loop
                if self.seqnum + counter >= dataSize:
                    data += "~"
                    break
                # otherwise extract data from our full set of data and use it to send
                data += allData[self.seqnum + counter]
                counter += 1

            # if there's no data to send, break out of loop and send nothing else
            if data == "":
                break

            # add checksum to our checksum counter
            checkSum += segmentSend.calc_checksum(data)

            # add to our data the checksum number (which is stripped by the receiver)
            data += str(checkSum)

            # Display sending segment
            segmentSend.setData(self.seqnum, data)
            print("Sending segment: ", segmentSend.to_string())

            # Use the unreliable sendChannel to send the segment
            self.sendChannel.send(segmentSend)
            self.windowSize -= 4  # remove from our window size
            self.seqnum += 4  # increase our seqnum

        # reset our seqnum in case there is an error getting back ack, it will start over
        self.seqnum = -1

    # ################################################################################################################ #
    # processReceive()                                                                                                 #
    #                                                                                                                  #
    # Description:                                                                                                     #
    # Manages Segment receive tasks                                                                                    #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #

    def processReceiveAndSendRespond(self):
        # Segment acknowledging packet(s) received
        segmentAck = Segment()

        # This call returns a list of incoming segments (see Segment class)...
        listIncomingSegments = self.receiveChannel.receive()

        print("processReceive():")
        incomingSize = len(listIncomingSegments)

        # set our starting window size at 0 (will count up through FLOW_CONTROL_WIN_SIZE (15))
        self.windowSize = 0

        # make sure there's data to add:
        if incomingSize != 0:

            # skip if this is the client sending
            if listIncomingSegments[incomingSize - 1].payload == "":
                return

            counter = 0

            # loop the counter through each incoming segment / break if window size is exceeded
            while (
                counter < incomingSize and self.windowSize <= self.FLOW_CONTROL_WIN_SIZE
            ):

                # check the checksum first to make sure no errors:
                # print("INCOMING PAYLOAD:", listIncomingSegments[counter].payload)

                # get our sequence number and the size of the new data
                currentSeqNum = listIncomingSegments[counter].seqnum
                newDataSize = len(self.newData)

                # if there's nothing in the payload, skip it and go to the next item (ack will re-request it later)
                if listIncomingSegments[counter].payload != "":

                    if self.acknum == -1:
                        self.acknum = 0  # change to 0 for first acknum

                    # call function to see if this sequence number was already saved to our new data. If true, skip adding
                    if (
                        checkPacketsReceived(
                            listIncomingSegments[counter].seqnum, self.receivedPackets
                        )
                        == False
                    ):
                        # print for testing ack and seq numbers:
                        # print("ACK NUMBER: ", self.acknum)
                        # print("SEQ NUMBER: ", currentSeqNum)

                        # use checksum to make sure contents are correct
                        receivingCheckSum = str(
                            listIncomingSegments[counter].payload[4:]
                        )
                        receivingCheckSum = receivingCheckSum
                        sendingCheckSum = str(
                            segmentAck.calc_checksum(
                                listIncomingSegments[counter].payload[:4]
                            )
                        )

                        # check if both are the same (no data errors if true)
                        if receivingCheckSum == sendingCheckSum:

                            # strip the checksum off of our payload
                            currentPayload = listIncomingSegments[counter].payload[0:4]

                            endingCharInt = currentPayload.find("~")
                            print("FOUND AT: ", endingCharInt)
                            if endingCharInt != -1:
                                currentPayload = currentPayload[0:endingCharInt]

                            # if we get something out of order, add it to the data by
                            # slicing and adding in where it's supposed to go, but don't increase
                            # ACK (still waiting for sequence that matches ack). Once we get it, we
                            # can reset the ACK to the next sequence wanted
                            if self.acknum != currentSeqNum:
                                if newDataSize < currentSeqNum:
                                    self.newData += currentPayload
                                    self.receivedPackets.append(
                                        listIncomingSegments[counter].seqnum
                                    )
                                else:
                                    # print("OUT OF ORDER!")
                                    temp = (
                                        self.newData[: self.acknum]
                                        + currentPayload
                                        + self.newData[self.acknum :]
                                    )
                                    self.newData = temp
                                    self.receivedPackets.append(
                                        listIncomingSegments[counter].seqnum
                                    )
                            else:  # ack and seq match, good to add to end of data
                                if newDataSize <= currentSeqNum:
                                    self.newData += currentPayload
                                    self.receivedPackets.append(
                                        listIncomingSegments[counter].seqnum
                                    )
                                    self.acknum = 4 + getAckNum(self.receivedPackets)
                                else:  # new item is out of order
                                    temp = (
                                        self.newData[:currentSeqNum]
                                        + currentPayload
                                        + self.newData[currentSeqNum:]
                                    )
                                    self.newData = temp
                                    self.receivedPackets.append(
                                        listIncomingSegments[counter].seqnum
                                    )
                                    self.acknum = 4 + getAckNum(self.receivedPackets)

                # add to our counter
                counter += 1
                # release window size space by adding 4 (size of data we are accepting)
                self.windowSize += 4

            # reset our window size to be fully available
            self.windowSize = 15

            # Display response segment
            segmentAck.setAck(self.acknum)
            # use the seqnum (not being used in the responding ack) as the window size available
            segmentAck.seqnum = self.windowSize
            print("Sending ack: ", segmentAck.to_string())
            # Use the unreliable sendChannel to send the ack packet
            self.sendChannel.send(segmentAck)
            return


# if we already have that packet number stored, return true
# if packet number is not in our stored array, return false and save it to our new data


def checkPacketsReceived(number, array):
    size = len(array)
    counter = 0
    while size > counter:
        if number == array[counter]:
            return True
        counter += 1
    return False


# function to get the highest sequence number, in order, that we have received
# (higher seqnum's won't be counted if we are missing items)
def getAckNum(arr):
    if len(arr) == 0:
        return 0
    counter = 0
    newAckNum = -1
    i = 0
    k = 0
    # loop through array to find any missing acknum's
    while i < len(arr):
        while k < len(arr):
            if counter == arr[k]:
                newAckNum = arr[k]
                break
            k += 1
        k = 0
        i += 1
        counter += 4
    if newAckNum == -1:
        return -4  # since calling function will add 4, we want it to return to -1
    return newAckNum

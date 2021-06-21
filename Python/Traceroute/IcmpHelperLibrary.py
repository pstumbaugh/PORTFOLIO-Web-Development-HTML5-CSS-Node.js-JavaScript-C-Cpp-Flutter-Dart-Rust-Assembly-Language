# Patrick Stumbaugh

# I rebuilt the "sendEchoRequest()" function for the traceroute program, in order to change some of
# the print statements and variables used so that it's more readable as a traceroute and not a ping program

# #################################################################################################################### #
# Imports                                                                                                              #
# #################################################################################################################### #
import os
from socket import *
import struct
import time
import select
from typing import Sequence

# global variables
minRTT = -1
maxRTT = -1
numberOfRTTs = 0
totalRTTtime = 0
packetsSent = 0
packetErrors = 0


# sets the min and max global RTT variables, depending upon the currentRTT
def setMinMaxRTT(currentRTT):
    global minRTT
    global maxRTT
    global numberOfRTTs
    global totalRTTtime

    # if it is the first iteration:
    if minRTT == -1:
        minRTT = currentRTT
        maxRTT = currentRTT

    # update our min and max if applicable
    if currentRTT < minRTT:
        minRTT = currentRTT
    if currentRTT > maxRTT:
        maxRTT = currentRTT

    # update our totals as well
    totalRTTtime = totalRTTtime + currentRTT
    numberOfRTTs = numberOfRTTs + 1


# returns the average RTT. If no RTT's, returns 0
def getAvgRTT():
    if numberOfRTTs == 0:  # no RTT's recorded, do nothing
        return 0
    else:
        return totalRTTtime / numberOfRTTs  # return the average


# prints out min, max and average RTT's
# the average RTT is calculated on exact RTT's, not the rounded that min and max will show
def printRTTs():
    average = getAvgRTT()
    print(" [*] PING RTT REPORT: ")
    print("     Min RTT: ", round(minRTT))
    print("     Max RTT: ", round(maxRTT))
    print(
        "     Avg RTT: ", round(average, 2), " *based on exact RTT times (not rounded)"
    )


# clears our RTT variables
def clearRTTs():
    global minRTT
    global maxRTT
    global numberOfRTTs
    global totalRTTtime
    # reset variables
    minRTT = -1
    maxRTT = -1
    numberOfRTTs = 0
    totalRTTtime = 0


# clears our packet error sum variables
def clearPacketErrorSum():
    global packetsSent
    global packetErrors
    # reset variables
    packetsSent = 0
    packetErrors = 0


# prints the number of packets lost during pings
def printPacketLossPercentage():
    global packetsSent
    global packetErrors
    if packetErrors == 0:
        percentLost = 0
    else:
        percentLost = (packetsSent / packetErrors) * 100
    percentSuccess = 100 - percentLost
    print(" [*] Packet Calculations: ")
    print("     Total Packets Sent: ", packetsSent)
    print("     Packets Lost: ", round(percentLost, 2), "%")
    print("     Packet Success: ", round(percentSuccess, 2), "%")

    # #################################################################################################################### #
    # Class IcmpHelperLibrary                                                                                              #
    # #################################################################################################################### #


class IcmpHelperLibrary:
    # ################################################################################################################ #
    # Class IcmpPacket                                                                                                 #
    #                                                                                                                  #
    # References:                                                                                                      #
    # https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml                                           #
    #                                                                                                                  #
    # ################################################################################################################ #
    class IcmpPacket:
        # ############################################################################################################ #
        # IcmpPacket Class Scope Variables                                                                             #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        __icmpTarget = ""  # Remote Host
        __destinationIpAddress = ""  # Remote Host IP Address
        __header = b""  # Header after byte packing
        __data = b""  # Data after encoding
        __dataRaw = ""  # Raw string data before encoding
        # Valid values are 0-255 (unsigned int, 8 bits)
        __icmpType = 0
        # Valid values are 0-255 (unsigned int, 8 bits)
        __icmpCode = 0
        # Valid values are 0-65535 (unsigned short, 16 bits)
        __packetChecksum = 0
        # Valid values are 0-65535 (unsigned short, 16 bits)
        __packetIdentifier = 0
        # Valid values are 0-65535 (unsigned short, 16 bits)
        __packetSequenceNumber = 0
        __ipTimeout = 30
        __ttl = 255  # Time to live

        __DEBUG_IcmpPacket = False  # Allows for debug output

        # ############################################################################################################ #
        # IcmpPacket Class Getters                                                                                     #
        # ############################################################################################################ #
        def getIcmpTarget(self):
            return self.__icmpTarget

        def getDataRaw(self):
            return self.__dataRaw

        def getIcmpType(self):
            return self.__icmpType

        def getIcmpCode(self):
            return self.__icmpCode

        def getPacketChecksum(self):
            return self.__packetChecksum

        def getPacketIdentifier(self):
            return self.__packetIdentifier

        def getPacketSequenceNumber(self):
            return self.__packetSequenceNumber

        def getTtl(self):
            return self.__ttl

        # ############################################################################################################ #
        # IcmpPacket Class Setters                                                                                     #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        def setIcmpTarget(self, icmpTarget):
            self.__icmpTarget = icmpTarget

            # Only attempt to get destination address if it is not whitespace
            if len(self.__icmpTarget.strip()) > 0:
                self.__destinationIpAddress = gethostbyname(self.__icmpTarget.strip())

        def setIcmpType(self, icmpType):
            self.__icmpType = icmpType

        def setIcmpCode(self, icmpCode):
            self.__icmpCode = icmpCode

        def setPacketChecksum(self, packetChecksum):
            self.__packetChecksum = packetChecksum

        def setPacketIdentifier(self, packetIdentifier):
            self.__packetIdentifier = packetIdentifier

        def setPacketSequenceNumber(self, sequenceNumber):
            self.__packetSequenceNumber = sequenceNumber

        def setTtl(self, ttl):
            self.__ttl = ttl

        # ############################################################################################################ #
        # IcmpPacket Class Private Functions                                                                           #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        def __recalculateChecksum(self):
            print("calculateChecksum Started...") if self.__DEBUG_IcmpPacket else 0
            packetAsByteData = b"".join([self.__header, self.__data])
            checksum = 0

            # This checksum function will work with pairs of values with two separate 16 bit segments. Any remaining
            # 16 bit segment will be handled on the upper end of the 32 bit segment.
            countTo = (len(packetAsByteData) // 2) * 2

            # Calculate checksum for all paired segments
            print(
                f'{"Count":10} {"Value":10} {"Sum":10}'
            ) if self.__DEBUG_IcmpPacket else 0
            count = 0
            while count < countTo:
                thisVal = packetAsByteData[count + 1] * 256 + packetAsByteData[count]
                checksum = checksum + thisVal
                checksum = (
                    checksum & 0xFFFFFFFF
                )  # Capture 16 bit checksum as 32 bit value
                print(
                    f"{count:10} {hex(thisVal):10} {hex(checksum):10}"
                ) if self.__DEBUG_IcmpPacket else 0
                count = count + 2

            # Calculate checksum for remaining segment (if there are any)
            if countTo < len(packetAsByteData):
                thisVal = packetAsByteData[len(packetAsByteData) - 1]
                checksum = checksum + thisVal
                checksum = checksum & 0xFFFFFFFF  # Capture as 32 bit value
                print(
                    count, "\t", hex(thisVal), "\t", hex(checksum)
                ) if self.__DEBUG_IcmpPacket else 0

            # Add 1's Complement Rotation to original checksum
            # Rotate and add to base 16 bits
            checksum = (checksum >> 16) + (checksum & 0xFFFF)
            checksum = (checksum >> 16) + checksum  # Rotate and add

            answer = ~checksum  # Invert bits
            answer = answer & 0xFFFF  # Trim to 16 bit value
            answer = answer >> 8 | (answer << 8 & 0xFF00)
            print("Checksum: ", hex(answer)) if self.__DEBUG_IcmpPacket else 0

            self.setPacketChecksum(answer)

        def __packHeader(self):
            # The following header is based on http://www.networksorcery.com/enp/protocol/icmp/msg8.htm
            # Type = 8 bits
            # Code = 8 bits
            # ICMP Header Checksum = 16 bits
            # Identifier = 16 bits
            # Sequence Number = 16 bits
            self.__header = struct.pack(
                "!BBHHH",
                self.getIcmpType(),  # 8 bits / 1 byte  / Format code B
                self.getIcmpCode(),  # 8 bits / 1 byte  / Format code B
                self.getPacketChecksum(),  # 16 bits / 2 bytes / Format code H
                self.getPacketIdentifier(),  # 16 bits / 2 bytes / Format code H
                self.getPacketSequenceNumber(),  # 16 bits / 2 bytes / Format code H
            )

        def __encodeData(self):
            # Used to track overall round trip time
            data_time = struct.pack("d", time.time())
            # time.time() creates a 64 bit value of 8 bytes
            dataRawEncoded = self.getDataRaw().encode("utf-8")

            self.__data = data_time + dataRawEncoded

        def __packAndRecalculateChecksum(self):
            # Checksum is calculated with the following sequence to confirm data in up to date
            # packHeader() and encodeData() transfer data to their respective bit
            self.__packHeader()
            # locations, otherwise, the bit sequences are empty or incorrect.
            self.__encodeData()
            self.__recalculateChecksum()  # Result will set new checksum value
            self.__packHeader()  # Header is rebuilt to include new checksum value

        # 1. Update the __validateIcmpReplyPacketWithOriginalPingData() function

        def __validateIcmpReplyPacketWithOriginalPingData(self, icmpReplyPacket):
            checkFlag = True

            # check sequence number
            if (
                self.getPacketSequenceNumber()
                != icmpReplyPacket.getIcmpSequenceNumber()
            ):
                checkFlag = False
                print(
                    "Packet Sequence number expected: ",
                    self.getPacketSequenceNumber(),
                    ", BUT - Packet Sequence number received: ",
                    icmpReplyPacket.getIcmpSequenceNumber(),
                )
                icmpReplyPacket.setIcmpIdentifier_isValid(False)
            else:
                icmpReplyPacket.setIcmpIdentifier_isValid(True)

            # check Identifier
            if self.getPacketIdentifier() != icmpReplyPacket.getIcmpIdentifier():
                checkFlag = False
                print(
                    "Packet Identifier expected: ",
                    self.getPacketIdentifier(),
                    ", BUT - Packet Identifier received: ",
                    icmpReplyPacket.getIcmpIdentifier(),
                )
                icmpReplyPacket.setIcmpSequenceNumber_isValid(False)
            else:
                icmpReplyPacket.setIcmpSequenceNumber_isValid(True)

            # check raw data
            if self.getDataRaw() != icmpReplyPacket.getIcmpData():
                checkFlag = False
                print(
                    "Raw Data expected: ",
                    self.getDataRaw(),
                    ", BUT - Raw Data received: ",
                    icmpReplyPacket.getDataRaw(),
                )
                icmpReplyPacket.setIcmpRawData_isValid_isValid(False)
            else:
                icmpReplyPacket.setIcmpRawData_isValid_isValid(True)

            # There was some sort of an error:
            if checkFlag == False:
                icmpReplyPacket.setIsValidResponse(False)
            # no error, continue on
            else:
                icmpReplyPacket.setIsValidResponse(True)

            pass

        # ############################################################################################################ #
        # IcmpPacket Class Public Functions                                                                            #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        def buildPacket_echoRequest(self, packetIdentifier, packetSequenceNumber):
            self.setIcmpType(8)
            self.setIcmpCode(0)
            self.setPacketIdentifier(packetIdentifier)
            self.setPacketSequenceNumber(packetSequenceNumber)
            self.__dataRaw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
            self.__packAndRecalculateChecksum()

        def sendEchoRequest(self):
            global packetsSent
            global packetErrors
            packetsSent = packetsSent + 1
            if (
                len(self.__icmpTarget.strip())
                <= 0 | len(self.__destinationIpAddress.strip())
                <= 0
            ):
                self.setIcmpTarget("127.0.0.1")

            print("Pinging (" + self.__icmpTarget + ") " + self.__destinationIpAddress)

            mySocket = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP)
            mySocket.settimeout(self.__ipTimeout)
            mySocket.bind(("", 0))
            mySocket.setsockopt(
                IPPROTO_IP, IP_TTL, struct.pack("I", self.getTtl())
            )  # Unsigned int - 4 bytes
            try:
                mySocket.sendto(
                    b"".join([self.__header, self.__data]),
                    (self.__destinationIpAddress, 0),
                )
                timeLeft = 30
                pingStartTime = time.time()
                startedSelect = time.time()
                whatReady = select.select([mySocket], [], [], timeLeft)
                endSelect = time.time()
                howLongInSelect = endSelect - startedSelect
                if whatReady[0] == []:  # Timeout
                    packetErrors = packetErrors + 1
                    print(
                        "  *        *        *        *        *    Request timed out."
                    )
                # recvPacket - bytes object representing data received
                recvPacket, addr = mySocket.recvfrom(1024)
                # addr  - address of socket sending data
                timeReceived = time.time()
                timeLeft = timeLeft - howLongInSelect
                if timeLeft <= 0:
                    packetErrors = packetErrors + 1
                    print(
                        "  *        *        *        *        *    Request timed out (By no remaining time left)."
                    )

                else:
                    # Fetch the ICMP type and code from the received packet
                    icmpType, icmpCode = recvPacket[20:22]

                    # 4. Your program can only detect timeouts in receiving ICMP echo responses.
                    # Modify the Pinger program to parse the ICMP response error codes and display the corresponding error results to the user.
                    if icmpType == 3:  # Destination Unreachable
                        packetErrors = packetErrors + 1
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print(
                                "ICMP CODE: ",
                                icmpCode,
                                ", Desination Network Unreachable",
                            )
                        elif icmpCode == 1:
                            print(
                                "ICMP CODE: ", icmpCode, ", Desination Host Unreachable"
                            )
                        elif icmpCode == 2:
                            print(
                                "ICMP CODE: ",
                                icmpCode,
                                ", Desination Protocol Unreachable",
                            )
                        elif icmpCode == 3:
                            print(
                                "ICMP CODE: ", icmpCode, ", Desination Port Unreachable"
                            )
                        elif icmpCode == 6:
                            print(
                                "ICMP CODE: ", icmpCode, ", Desination Network Unknown"
                            )
                        elif icmpCode == 7:
                            print("ICMP CODE: ", icmpCode, ", Desination Host Unknown")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 4:  # Source Quence
                        packetErrors = packetErrors + 1
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print("ICMP CODE: ", icmpCode, ", Source Quench")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 11:  # Time Exceeded
                        packetErrors = packetErrors + 1
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print("ICMP CODE: ", icmpCode, ", TTL Expired")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 12:  # bad IP header
                        packetErrors = packetErrors + 1
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print("ICMP CODE: ", icmpCode, ", Bad IP Header")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 0:  # Echo Reply
                        icmpReplyPacket = IcmpHelperLibrary.IcmpPacket_EchoReply(
                            recvPacket
                        )
                        self.__validateIcmpReplyPacketWithOriginalPingData(
                            icmpReplyPacket
                        )
                        icmpReplyPacket.printResultToConsole(
                            self.getTtl(), timeReceived, addr, self
                        )
                        return  # Echo reply is the end and therefore should return
                    else:
                        print("unknown error")

            except timeout:
                print(
                    "  *        *        *        *        *    Request timed out (By Exception)."
                )
            finally:
                mySocket.close()

        # ----------
        # I rebuilt the echo request to set some features I didn't want changing in the original

        def sendTraceRouteEchoRequest(self):
            if (
                len(self.__icmpTarget.strip())
                <= 0 | len(self.__destinationIpAddress.strip())
                <= 0
            ):
                self.setIcmpTarget("127.0.0.1")

            print(
                "Tracing to (" + self.__icmpTarget + ") " + self.__destinationIpAddress,
                " with TTL of ",
                self.getTtl(),
            )

            mySocket = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP)
            mySocket.settimeout(self.__ipTimeout)
            mySocket.bind(("", 0))
            mySocket.setsockopt(
                IPPROTO_IP, IP_TTL, struct.pack("I", self.getTtl())
            )  # Unsigned int - 4 bytes
            try:
                mySocket.sendto(
                    b"".join([self.__header, self.__data]),
                    (self.__destinationIpAddress, 0),
                )
                timeLeft = 30
                pingStartTime = time.time()
                startedSelect = time.time()
                whatReady = select.select([mySocket], [], [], timeLeft)
                endSelect = time.time()
                howLongInSelect = endSelect - startedSelect
                if whatReady[0] == []:  # Timeout
                    print(
                        "  *        *        *        *        *    Request timed out."
                    )
                # recvPacket - bytes object representing data received
                recvPacket, addr = mySocket.recvfrom(1024)
                # addr  - address of socket sending data
                timeReceived = time.time()
                timeLeft = timeLeft - howLongInSelect

                if timeLeft <= 0:
                    print(
                        "  *        *        *        *        *    Request timed out (By no remaining time left)."
                    )

                else:
                    # Fetch the ICMP type and code from the received packet
                    icmpType, icmpCode = recvPacket[20:22]

                    if icmpType == 3:  # Destination Unreachable
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print(
                                "ICMP CODE: ",
                                icmpCode,
                                ", Desination Network Unreachable",
                            )
                        elif icmpCode == 1:
                            print(
                                "ICMP CODE: ", icmpCode, ", Desination Host Unreachable"
                            )
                        elif icmpCode == 2:
                            print(
                                "ICMP CODE: ",
                                icmpCode,
                                ", Desination Protocol Unreachable",
                            )
                        elif icmpCode == 3:
                            print(
                                "ICMP CODE: ", icmpCode, ", Desination Port Unreachable"
                            )
                        elif icmpCode == 6:
                            print(
                                "ICMP CODE: ", icmpCode, ", Desination Network Unknown"
                            )
                        elif icmpCode == 7:
                            print("ICMP CODE: ", icmpCode, ", Desination Host Unknown")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 4:  # Source Quence
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print("ICMP CODE: ", icmpCode, ", Source Quench")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 11:  # Time Exceeded
                        self.setIcmpType(icmpType)
                        self.setIcmpCode(icmpCode)
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print("ICMP CODE: ", icmpCode, ", TTL Expired")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 12:  # bad IP header
                        print(
                            "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d    %s"
                            % (
                                self.getTtl(),
                                (timeReceived - pingStartTime) * 1000,
                                icmpType,
                                icmpCode,
                                addr[0],
                            )
                        )
                        if icmpCode == 0:
                            print("ICMP CODE: ", icmpCode, ", Bad IP Header")
                        else:  # generic error
                            print("ICMP CODE: ", icmpCode, ", unknown error")

                    elif icmpType == 0:  # Echo Reply
                        icmpReplyPacket = IcmpHelperLibrary.IcmpPacket_EchoReply(
                            recvPacket
                        )
                        self.__validateIcmpReplyPacketWithOriginalPingData(
                            icmpReplyPacket
                        )
                        icmpReplyPacket.printResultToConsole(
                            self.getTtl(), timeReceived, addr, self
                        )
                        return  # Echo reply is the end and therefore should return

                    else:

                        print("error")
            except timeout:
                print(
                    "  *        *        *        *        *    Request timed out (By Exception)."
                )
            finally:
                mySocket.close()

        # -------

        def printIcmpPacketHeader_hex(self):
            print("Header Size: ", len(self.__header))
            for i in range(len(self.__header)):
                print("i=", i, " --> ", self.__header[i : i + 1].hex())

        def printIcmpPacketData_hex(self):
            print("Data Size: ", len(self.__data))
            for i in range(len(self.__data)):
                print("i=", i, " --> ", self.__data[i : i + 1].hex())

        def printIcmpPacket_hex(self):
            print("Printing packet in hex...")
            self.printIcmpPacketHeader_hex()
            self.printIcmpPacketData_hex()

    # ################################################################################################################ #
    # Class IcmpPacket_EchoReply                                                                                       #
    #                                                                                                                  #
    # References:                                                                                                      #
    # http://www.networksorcery.com/enp/protocol/icmp/msg0.htm                                                         #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    class IcmpPacket_EchoReply:
        # ############################################################################################################ #
        # IcmpPacket_EchoReply Class Scope Variables                                                                   #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        __recvPacket = b""
        __isValidResponse = False
        __IcmpIdentifier_isValid = False
        __IcmpSequenceNumber_isValid = False
        __IcmpRawData_isValid = False

        # ############################################################################################################ #
        # IcmpPacket_EchoReply Constructors                                                                            #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #

        def __init__(self, recvPacket):
            self.__recvPacket = recvPacket

        # ############################################################################################################ #
        # IcmpPacket_EchoReply Getters                                                                                 #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        def getIcmpType(self):
            # Method 1
            # bytes = struct.calcsize("B")        # Format code B is 1 byte
            # return struct.unpack("!B", self.__recvPacket[20:20 + bytes])[0]

            # Method 2
            return self.__unpackByFormatAndPosition("B", 20)

        def getIcmpCode(self):
            # Method 1
            # bytes = struct.calcsize("B")        # Format code B is 1 byte
            # return struct.unpack("!B", self.__recvPacket[21:21 + bytes])[0]

            # Method 2
            return self.__unpackByFormatAndPosition("B", 21)

        def getIcmpHeaderChecksum(self):
            # Method 1
            # bytes = struct.calcsize("H")        # Format code H is 2 bytes
            # return struct.unpack("!H", self.__recvPacket[22:22 + bytes])[0]

            # Method 2
            return self.__unpackByFormatAndPosition("H", 22)

        def getIcmpIdentifier(self):
            # Method 1
            # bytes = struct.calcsize("H")        # Format code H is 2 bytes
            # return struct.unpack("!H", self.__recvPacket[24:24 + bytes])[0]

            # Method 2
            return self.__unpackByFormatAndPosition("H", 24)

        def getIcmpSequenceNumber(self):
            # Method 1
            # bytes = struct.calcsize("H")        # Format code H is 2 bytes
            # return struct.unpack("!H", self.__recvPacket[26:26 + bytes])[0]

            # Method 2
            return self.__unpackByFormatAndPosition("H", 26)

        def getDateTimeSent(self):
            # This accounts for bytes 28 through 35 = 64 bits
            # Used to track overall round trip time
            return self.__unpackByFormatAndPosition("d", 28)
            # time.time() creates a 64 bit value of 8 bytes

        def getIcmpData(self):
            # This accounts for bytes 36 to the end of the packet.
            return self.__recvPacket[36:].decode("utf-8")

        def isValidResponse(self):
            return self.__isValidResponse

        # 1(c) New getters ->

        def getIcmpIdentifier_isValid(self):
            return self.__IcmpIdentifier_isValid

        def getIcmpSequenceNumber_isValid(self):
            return self.__IcmpSequenceNumber_isValid

        def getIcmpRawData_isValid(self):
            return self.__IcmpRawData_isValid

        # ############################################################################################################ #
        # IcmpPacket_EchoReply Setters                                                                                 #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        def setIsValidResponse(self, booleanValue):
            self.__isValidResponse = booleanValue

        # 1(c) New Setters ->
        def setIcmpIdentifier_isValid(self, booleanValue):
            self.__IcmpIdentifier_isValid = booleanValue

        def setIcmpSequenceNumber_isValid(self, booleanValue):
            self.__IcmpSequenceNumber_isValid = booleanValue

        def setIcmpRawData_isValid_isValid(self, booleanValue):
            self.__IcmpRawData_isValid = booleanValue

        # ############################################################################################################ #
        # IcmpPacket_EchoReply Private Functions                                                                       #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #
        def __unpackByFormatAndPosition(self, formatCode, basePosition):
            numberOfbytes = struct.calcsize(formatCode)
            return struct.unpack(
                "!" + formatCode,
                self.__recvPacket[basePosition : basePosition + numberOfbytes],
            )[0]

        # ############################################################################################################ #
        # IcmpPacket_EchoReply Public Functions                                                                        #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        #                                                                                                              #
        # ############################################################################################################ #

        # 2. Update the printResultToConsole() function:
        # Identify if the echo response is valid and report the error information details.
        # For example, if the raw data is different, print to the console what the expected value and the actual value.

        # 3. Currently, the program calculates the round-trip time for each packet and prints it out individually.
        # Modify the code to correspond to the way the standard ping program works.
        # You will need to report the minimum, maximum, and average RTTs at the end of all pings from the client.
        # In addition, calculate the packet loss rate (in percentage).
        # It is recommended to create an output that is easily readable with the amount of data used for a trace route since a ping
        # is the foundation for such functionality.

        def printResultToConsole(self, ttl, timeReceived, addr, original):
            bytes = struct.calcsize("d")
            timeSent = struct.unpack("d", self.__recvPacket[28 : 28 + bytes])[0]
            print(
                "  TTL=%d    RTT=%.0f ms    Type=%d    Code=%d        Identifier=%d    Sequence Number=%d    %s"
                % (
                    ttl,
                    (timeReceived - timeSent) * 1000,
                    self.getIcmpType(),
                    self.getIcmpCode(),
                    self.getIcmpIdentifier(),
                    self.getIcmpSequenceNumber(),
                    addr[0],
                )
            )

            if self.getIcmpIdentifier_isValid == False:
                print(
                    "ICMP Identifier invalid. Received: ",
                    self.getIcmpIdentifier(),
                    "BUT - expected ",
                    original.getPacketIdentifier(),
                )
            if self.getIcmpSequenceNumber_isValid == False:
                print(
                    "ICMP Sequence Number invalid. Received: ",
                    self.getIcmpSequenceNumber(),
                    "BUT - expected ",
                    original.getPacketSequenceNumber(),
                )
            if self.getIcmpRawData_isValid == False:
                print(
                    "ICMP Raw Data invalid. Received: ",
                    self.getIcmpData(),
                    "BUT - expected ",
                    original.getDataRaw(),
                )

            currentRTT = (timeReceived - timeSent) * 1000
            setMinMaxRTT(currentRTT)  # set our min and max RTT's

    # ################################################################################################################ #
    # Class IcmpHelperLibrary                                                                                          #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #

    # ################################################################################################################ #
    # IcmpHelperLibrary Class Scope Variables                                                                          #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    __DEBUG_IcmpHelperLibrary = False  # Allows for debug output

    # ################################################################################################################ #
    # IcmpHelperLibrary Private Functions                                                                              #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #
    def __sendIcmpEchoRequest(self, host):
        print("sendIcmpEchoRequest Started...") if self.__DEBUG_IcmpHelperLibrary else 0

        for i in range(4):
            # Build packet
            icmpPacket = IcmpHelperLibrary.IcmpPacket()

            # Get as 16 bit number - Limit based on ICMP header standards
            randomIdentifier = os.getpid() & 0xFFFF
            # Some PIDs are larger than 16 bit

            packetIdentifier = randomIdentifier
            packetSequenceNumber = i

            icmpPacket.buildPacket_echoRequest(
                packetIdentifier, packetSequenceNumber
            )  # Build ICMP for IP payload
            icmpPacket.setIcmpTarget(host)
            # Build IP
            icmpPacket.sendEchoRequest()

            icmpPacket.printIcmpPacketHeader_hex() if self.__DEBUG_IcmpHelperLibrary else 0
            icmpPacket.printIcmpPacket_hex() if self.__DEBUG_IcmpHelperLibrary else 0
            # we should be confirming values are correct, such as identifier and sequence number and data

    def __sendIcmpTraceRoute(self, host):
        print("sendIcmpTraceRoute Started...") if self.__DEBUG_IcmpHelperLibrary else 0

        # 5. The skeleton code currently has a placeholder for performing a trace route function.
        # It starts with the traceRoute() function and uses private functions to carry out the implementation.

        for ttl in range(1, 255):  # assume 255 for our max ttl we will allow
            # Build packet
            icmpPacket = IcmpHelperLibrary.IcmpPacket()

            # Get as 16 bit number - Limit based on ICMP header standards
            randomIdentifier = os.getpid() & 0xFFFF
            # Some PIDs are larger than 16 bit

            packetIdentifier = randomIdentifier
            packetSequenceNumber = ttl
            icmpPacket.setTtl(ttl)

            icmpPacket.buildPacket_echoRequest(
                packetIdentifier, packetSequenceNumber
            )  # Build ICMP for IP payload
            icmpPacket.setIcmpTarget(host)
            # Build IP

            icmpPacket.sendTraceRouteEchoRequest()
            # if it has reached the final destination...
            if icmpPacket.getIcmpCode() == 0 and icmpPacket.getIcmpType() == 8:
                print(" [!] Destination reached!")
                print()
                break
            if ttl == 255:
                print(" [#] Destination not reachable in 255 stops")
                break

    # if the echo reply comes back fine, return, else:
    # ttl = ttl + 1

    # self.setTtl(2)
    # print(self.getTtl())

    # ################################################################################################################ #
    # IcmpHelperLibrary Public Functions                                                                               #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    #                                                                                                                  #
    # ################################################################################################################ #

    def sendPing(self, targetHost):
        clearRTTs()  # clears RTT's for this item
        clearPacketErrorSum()  # clears the packet error variables we use for calculating packet loss %
        print("ping Started...") if self.__DEBUG_IcmpHelperLibrary else 0
        self.__sendIcmpEchoRequest(targetHost)
        printRTTs()  # prints out RTT's for this item
        printPacketLossPercentage()  # prints out packet loss percentage

    def traceRoute(self, targetHost):
        print("traceRoute Started...") if self.__DEBUG_IcmpHelperLibrary else 0
        self.__sendIcmpTraceRoute(targetHost)


# #################################################################################################################### #
# main()                                                                                                               #
#                                                                                                                      #
#                                                                                                                      #
#                                                                                                                      #
#                                                                                                                      #
# #################################################################################################################### #
def main():
    icmpHelperPing = IcmpHelperLibrary()

    print()
    print(" [#] STARTING PING: ")
    icmpHelperPing.sendPing("www.google.com")
    # icmpHelperPing.sendPing("oregonstate.edu")
    # icmpHelperPing.sendPing("en.parisinfo.com") # website in Europe
    # icmpHelperPing.sendPing("www.gov.za") # website in south africa
    # icmpHelperPing.sendPing("patrickstumbaugh.com")
    # icmpHelperPing.sendPing("www.koreaherald.com") # website in asia

    print()
    print(" [#] STARTING TRACEROUTE: ")
    icmpHelperPing.traceRoute("www.google.com")
    # icmpHelperPing.traceRoute("www.patrickstumbaugh.com")
    # icmpHelperPing.traceRoute("www.gov.za")
    # icmpHelperPing.traceRoute("travelportland.com")


if __name__ == "__main__":
    main()

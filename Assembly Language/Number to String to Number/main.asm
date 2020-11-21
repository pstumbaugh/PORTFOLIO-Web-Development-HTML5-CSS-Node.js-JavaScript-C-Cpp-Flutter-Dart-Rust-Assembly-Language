TITLE Num to String to Num     (Project6.asm)

; Author: Patrick Stumbaugh

; Description: Get's numerical input from user, changes it to string bytes
;	then displays that string. Then it changes back to numbers and displays
;	the average and the sum

INCLUDE Irvine32.inc

;constants
ARRAYMAX = 10
STRINGMAX = 20


;getString macro
;receives: title string, size of that string, and string to display prompt
;registers changed: edx, eax, ecx
mGetString MACRO mUserString, UserStringSize, prompt
	push ecx
	push edx
;prompt for the number string
	mov edx, prompt 
	call WriteString
;get the number string and store it
	mov	edx, mUserString
	mov ecx, userStringSize
	call readString

	pop edx
	pop ecx
ENDM 



;displayString macro
;receives: the user's string to display
;registers changed: edx
mDisplayString	MACRO	mUserString
	pushad
	mov		edx, mUserString
	call	WriteString
	popad
ENDM


.data

;variables
hello1		BYTE "PROGRAMMING ASSIGNMENT 6: Designing low-level "
			BYTE "I/O procedures",0 
hello2		BYTE " Written by: Patrick Stumbaugh",0 
intro1		BYTE "Please provide 10 signed decimal integers.",0 
intro2		BYTE "Each number needs to be small enough to fit inside "
			BYTE "a 32 bit register.",0 
intro3		BYTE "After you have finished inputting the raw numbers "
			BYTE "I will display a list of the integers, their sum, "
			BYTE "and their average value.",0 
ask			BYTE "Please enter an signed number: ",0 
error		BYTE "ERROR: You did not enter a signed number or "
			BYTE "your number was too big.",0 
tryAgain	BYTE "Please try again: ",0 
showNumbers	BYTE "You entered the following numbers: ",0 
showSum		BYTE "The sum of these numbers is: ",0 
showAverage	BYTE "The rounded average is: ",0 
comma		BYTE ", ",0
goodbye		BYTE "Thanks for playing!",0 
space		BYTE ". ",0
subtotal	BYTE "Current subtotal is: ",0
myError		BYTE "**I was unable to get the program to accept a negative"
			BYTE " number. I left my coding for it commented out so you can "
			BYTE "see what I was trying. Any negative number entered will"
			BYTE " show up as a positive number for now.",0

flag		DWORD 0

array		DWORD ARRAYMAX DUP(?) ;max ARRAYSIZE is 10 
userString	BYTE 20 DUP(?) 
uStringSize	DWORD 0
userString2	BYTE 20	DUP(?)
userNumber	DWORD ARRAYMAX DUP (?) 
inputLength	DWORD 0 

.code
main PROC

;display intro and instructions (using macro call)
	mDisplayString OFFSET hello1
	call	CrLf
	mDisplayString OFFSET hello2
	call	CrLf
	call	CrLf
	mDisplayString OFFSET intro1
	call	CrLf
	mDisplayString OFFSET intro2
	call	CrLf
	mDisplayString OFFSET intro3
	call	CrLF
	call	CrLf

;displaying my error prompt
	mDisplayString OFFSET myError
	call	CrLf
	call	CrLf

;get 10 numbers from user.
	mov		uStringSize, (SIZEOF userString) -1
	push	uStringSize
	push	OFFSET inputLength
	push	OFFSET tryAgain
	push	OFFSET array
	push	ARRAYMAX
	push	OFFSET userNumber
	push	OFFSET userString
	push	OFFSET ask
	push	OFFSET error
	push	flag
	call	readVal


;displaying the numbers the user entered:
;(writeVal procedure called within this displayNumbers call)
	mov		inputLength, LENGTHOF array		;using inputLength as loop counter
	push	OFFSET array
	push	OFFSET showNumbers
	push	OFFSET comma
	push	inputLength
	call	displayNumbers

;save input length of array for next two operations (sum and average calls)
	mov		inputLength, LENGTHOF array
	call	CrLf

;display the sum
	mDisplayString OFFSET showSum
	push	OFFSET array
	push	inputLength
	call	getSum
	call	CrLf

;display the average
	mDisplayString	OFFSET showAverage
	push	OFFSET array
	push	inputLength
	call	getAverage

;display goodbye message
	call	CrLf
	mDisplayString OFFSET goodbye
	call	CrLf
	call	CrLf

	exit	; exit to operating system
main ENDP


;Procedures

;----------------------------------------------------------------------------
;reads a value from user and stores it in array
;receives: array, userString, inputLength, ask prompt, error prompt, userNumber
;registers changed: 
readVal PROC
	push	ebp
	mov		ebp, esp

	mov		ecx, [ebp+28]		;ARRAYMAX - 10 for Program 6
	mov		edi, [ebp+32]		;array
	mov		ebx, 1

L1:
	mov		eax, ebx			;display line counter
	call	writeDec
	mDisplayString OFFSET space
	pushad
	push	[ebp+44]			;uStringSize
	push	[ebp+8]				;error
	push	[ebp+24]			;userNumber
	push	[ebp+36]			;tryAgain 
	push	[ebp+16]			;ask
	push	[ebp+40]			;inputLength
	push	[ebp+20]			;userString
	call	readSingleVal		;prompts user for a value to store
	popad

;store user's entered number in array at edi current position
	mov		eax, [ebp+24]		;userNumber
	mov		eax, [eax]
	mov		[edi], eax
	add		edi, 4
	inc		ebx					;line counter
	loop	L1

	pop		ebp
	ret		40
readVal ENDP


;----------------------------------------------------------------------------
;reads a integer value from user, changes to string bytes
;receives: userString, inputLength, ask prompt, error prompt, userNumber
;registers changed: eax (+al), ebp, edx, ecx, esi, edi, 
readSingleVal PROC
	push	ebp
	mov		ebp, esp

;ask and get user number string
	push	eax
	mov		eax, [ebp+32]				;uStringSize
	mGetString [ebp+8], eax, [ebp+16]	;userString, uStringSize, ask
	mov		[ebp+12], eax				;inputLength
	pop		eax
	jmp		setup

;previous input bad, show error and prompt to try again 
numError: 
	mov		userNumber, 0
	mDisplayString OFFSET error
	call	CrLf
	push	eax
	mov		eax, [ebp+32]				;uStringSize
	mGetString [ebp+8], eax, [ebp+20]	;userString, uStringSize, tryAgain
	mov		[ebp+12], eax				;inputLength
	pop		eax

setup:
;setup our ecx and esi registers 
	cld
	xor		edx, edx		
	xor		eax, eax		
	mov		ecx, [ebp+12]	;length of the user's inputted string  
	mov		esi, [ebp+8]
	mov		edi, [ebp+24] 

;checks if first byte of string is the + or - sign for the integer added 
checkSign: 
	lodsb 
	cmp		al, 43			;compares to + sign 
	je		addPos
	cmp		al, 45			;compares to - sign
	je		addNeg
	jne		checkNumbers2

;checks that the rest of the string is digits 
checkNumbers: 
	lodsb					
checkNumbers2:

	cmp		al, 48			;compare to low digit, 0 
	jl		numError 
	cmp		al, 57			;compare to top digit, 9 
	jg		numError 
	jmp		addNumber

addNumber:
	imul	edx, 10			;multiply prev by 10 to get to correct spot
	sub		al, 48			;sub 48 to get decimal number
	add		edx, eax		;add new number to edx

	loop	checkNumbers

;check number within signed bounds
	mov		eax, edx		;full userNumber in edx
	cmp		eax, 213748647  ;max positive number
	jg		numError
	cmp		eax, -213748648
	jl		numError
	jmp		finish

addPos:
	imul	edx, 10			;multiply prev by 10 to get to correct spot
	loop	checkNumbers


addNeg:
	imul	edx, 10			;multiply prev by 10 to get to correct spot
	mov		flag, 1
	loop	checkNumbers

finish:
	mov		eax, edx		;store the new number in the user variable
	mov		ebx, [ebp+24]	;userNumber
	mov		[ebx], eax
	cmp		flag, 1			;flag = 1 = negative, flag = 0 = positive
	jne		finish2
;	neg dword ptr [ebx]		;attempt to get negative number??

finish2:
	pop		ebp
	ret		28
readSingleVal ENDP




;----------------------------------------------------------------------------
;changes the values in array to string, displays the strings
;receives: array address
;registers changed: eax (+al), ebx edx, ecx, edi, 
writeVal	PROC,
	pointNumber:		PTR DWORD	; address of number
	LOCAL pLength:		DWORD		; length of number
	LOCAL pstring[20]:	BYTE		; temp string variable
	pushad							

;get how many digits			
	mov		pLength, 0				
	mov		eax, [pointNumber]		
	mov		eax, [eax]				
	mov		ebx, 10d				; set our divisor
;loop until out of digits
L1:
	xor		edx, edx				
	cmp		eax, 0
	je		stopCount				
	div		ebx						
	cdq
	mov		eax, eax
	inc		pLength					
	jmp		L1
;stop counting and setup edi/esi
stopCount:
	mov		ecx, pLength			
	cmp		ecx, 0					; if no length, print nothing
	je		nothingHere
	lea		edi, pstring			; set source position
	add		edi, pLength			; set destination position (# bytes)
				

;	change from integer to string
;setup
	std
	push	ecx
	mov		al, 0
	stosb
	pop		ecx

;setup eax, ebx
	mov		eax, pointNumber			
	mov		eax, [eax]			
	mov		ebx, 10d			
	
;loop to get all numbers stored
L2:
	xor		edx, edx		
	mov		ebx, 10d		
	cdq
	div		ebx				
	add		edx, 48d		
	push	eax				
	mov		eax, edx		
	stosb					
	pop		eax				
	cmp		eax, 0			
	je		print			
	jmp		L2				

;if nothing to save, save 0
nothingHere:
	push	ecx
	mov		ecx, 2
	xor		eax, eax		; clear the eax register
	add		eax, 48d
	push	eax
	mov		al, '0'
	call	WriteChar
	pop		eax
	pop		ecx

	JMP		finish

;print the number to the user's string
print:
	lea		eax, pstring
	mDisplayString  eax

finish:
	popad					
	ret		4
writeVal	ENDP



;----------------------------------------------------------------------------
;Gets the sum of numbers in array 
;receives: array address and inputLength
;registers changed: ebp, ecx, eax, edi, edx
getSum PROC
	push	ebp
	mov		ebp, esp
;setup
	mov		ecx, [ebp+8]		;inputLength
	mov		eax, 0
	mov		edi, [ebp+12]		;array

;add numbers together
L1:
	add		eax, [edi]
	add		edi, 4
	loop	L1

;display sum number
	mov		[edi],eax
	push	edi
	call	WriteVal			;calls WriteVal procedure
								;(converts number to string and outputs)
	pop		ebp
	ret		8
getSum ENDP



;----------------------------------------------------------------------------
;Gets the average of numbers in array 
;receives: array address and inputLength
;registers changed: ebp, ecx, eax, edi, ebx, edx
getAverage PROC
	push	ebp
	mov		ebp, esp

;setup
	mov		ecx, [ebp+8]		;inputLength
	mov		eax, 0
	mov		edi, [ebp+12]		;array
	xor		edx, edx			;clear the edx

;add all numbers together to get a sum
L1:
	add		eax, [edi]
	add		edi, 4
	loop	L1

;divide to get average
	mov		ebx, [ebp+8]		;inputLength
	cld
	idiv	ebx					;average stored in eax register

;display average number
	mov		[edi],eax
	push	edi
	call	WriteVal			;calls WriteVal procedure
								;(converts number to string and outputs)

	pop		ebp
	ret		8
getAverage ENDP



;----------------------------------------------------------------------------
;displays each number in array
;receives: array, showNumbers text, comma text, and inputLength
;registers changed: ebp, ecx, eax, edi, ebx, edx
displayNumbers PROC
	push	ebp
	mov		ebp, esp

;setup registers
	mov		ecx, [ebp+8]		;inputLength
	sub		ecx, 1
	mov		edx, [ebp+16]		;showNumbers
	call	writeString
	mov		edi, [ebp+20]		;array

;loop through array, dispaly each number
L1:
	push	edi
	call	writeVal			;calls the writeVal proc
	mDisplayString [ebp+12]
	add		edi, 4
	loop	L1

;last number (without comma)
	push	edi
	call	WriteVal
	call	CrLf

	pop		ebp
	ret		16
displayNumbers	ENDP



END main

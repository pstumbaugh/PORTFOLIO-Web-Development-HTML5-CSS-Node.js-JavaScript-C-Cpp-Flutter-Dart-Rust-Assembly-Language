
; Author: Patrick Stumbaugh

; Description: Sorting and Counting Random Integers



INCLUDE Irvine32.inc

;global constants
ARRAYSIZE = 200
LO = 10
HI = 29

.data

intro		BYTE "Sorting and Counting Random integers!",0
intro2		BYTE "Programmed by Pat Stumbaugh",0
intro3		BYTE "This program generates 200 random numbers in the range "
			BYTE "[10 ... 29], displays the original list, sorts the list, "
			BYTE "displays the median value, displays the list sorted in "
			BYTE "ascending order, then displays the number of instances"
			BYTE "of each generated value.",0
unsort		BYTE "Your unsorted random numbers: ",0
sort		BYTE "Your sorted random numbers:",0
medianIntro	BYTE "List Median: ",0
instances	BYTE "Your list of instances of each generated number, "
			BYTE "starting with the number of 10s:",0
spaces		BYTE "  ",0
cList		BYTE "Your list of instances of each generated number, "
			BYTE "starting with the number of 10s:",0
goodbye		BYTE "Goodbye, and thanks for using my program!",0
array		DWORD 200 DUP(?)
countArray	DWORD 200 DUP(?)
cArraySize	DWORD 0




.code
main PROC

;introduce the program
	push	OFFSET intro
	push	OFFSET intro2
	push	OFFSET intro3
	call	introduction

;fill the array
	push	OFFSET array
	push	ARRAYSIZE
	push	HI
	push	LO
	call	fillArray
	call	CrLf

;display title of unsorted array
	push	OFFSET unsort
	call	displayTitle
	call	CrLf

;display the unsorted list
	push	OFFSET array
	push	ARRAYSIZE
	push	OFFSET spaces
	call	displayArray					;display array call #1
	call	CrLf
	call	CrLf

;sort our array
	push	OFFSET array
	push	ARRAYSIZE
	call	sortList

;display title of median
	push	OFFSET medianIntro
	call	displayTitle

;display median
	push	OFFSET array
	push	ARRAYSIZE
	call	displayMedian
	call	CrLf
	call	CrLf

;display title of sorted array
	push	OFFSET sort
	call	displayTitle
	call	CrLf
	
;display sorted list
	push	OFFSET array
	push	ARRAYSIZE
	push	OFFSET spaces
	call	displayArray					;display array call #2
	call	CrLf

;display title for count list
	push	OFFSET cList
	call	displayTitle
	call	CrLf

;count the items in list and store them in countArray
	push	OFFSET array
	push	OFFSET countArray
	push	ARRAYSIZE
	push	OFFSET cArraySize
	call	countList

;display the counted array
	push	OFFSET countArray
	push	cArraySize
	push	OFFSET spaces
	call	displayArray					;display array call #3
	call	CrLf
	call	CrLf

;display goodbye message
	push	OFFSET goodbye
	call	displayTitle
	call	CrLf

	exit	; exit to operating system
main ENDP



;FUNCTIONS BELOW
;***************************************************************************

;introduces the program
;receives: addresses of intro, intro2 and intro3
;registers changed: ebp, edx
introduction PROC
	push	ebp
	mov		ebp, esp

	mov		edx, [ebp+16]
	call	WriteString
	call	CrLf
	mov		edx, [ebp+12]
	call	writeString
	call	CrLf
	call	CrLf
	mov		edx, [ebp+8]
	call	writeString
	call	CrLf

	pop		ebp
	ret		12
introduction ENDP




;fills the array with random numbers, within a specified range
;receives: address of array, array's size, low and high bounds
;registers changed: ebp, ecx, eax
fillArray PROC
	push	ebp
	mov		ebp, esp

	mov		esi, [ebp+20]			;address of array
	mov		ecx, [ebp+16]			;arraySize

getNumber:
;generate a random number within our range
	mov		eax, [ebp+12]			;hi
	sub		eax, [ebp+8]			;lo
	inc		eax
	call	RandomRange
	add		eax, [ebp+8]			;lo

;store the random number in our next array position
	mov		[esi], eax
	add		esi, 4
	loop	getNumber

	pop		ebp
	ret		16
fillArray ENDP




;display the title of the upcoming array
;receives: address of title to display, 
;registers changed: ebp, edx
displayTitle PROC
	push	ebp
	mov		ebp, esp

	mov		edx, [ebp+8]			;(whichever string we pushed in main)
	call	WriteString

	pop		ebp
	ret		4
displayTitle ENDP




;displays the called array
;receives: address of array, size of the array, and spaces string
;registers changed: ebp, ecx, edx, ebx, eax
displayArray PROC
	push	ebp
	mov		ebp, esp

;setup the list and counter
	mov		esi, [ebp+16]			;address of array
	mov		ecx, [ebp+12]			;arraySize
	mov		edx, [ebp+8]			;spaces

;setup a columns counter
	mov		ebx, 20					
		
;display the array
L1:
	mov		eax, [esi]
	call	WriteDec
	call	WriteString
	add		esi, 4
	dec		ebx
	cmp		ebx, 0
	jnz		continue
;if out of columns, make a new line
	mov		ebx, 20					;reset columns counter
	call	CrLf
continue:
	loop	L1

	pop		ebp
	ret		12
displayArray ENDP





;sort list function sorts the list from lowest to highest
;works by comparing the first number in the list to all the rest of the numbers
;if a number lower than the current number is found, the two are switched, 
;and the search starts over from the beginning of that current number. Once
;that number reaches an endpoint (no more to switch with), the function moves
;on to the next number in the list and does the same.
;receives: address of array, array's size
;registers affected: ebp, ecx, ebx, eax
sortList PROC
	push	ebp
	mov		ebp, esp

	mov		ecx, [ebp+8]			;arraySize
	mov		esi, [ebp+12]			;array
	sub		ecx, 1					;to keep our loop control in bounds

start:
	push	esi
	mov		ebx, 0
compare:
	mov		eax, [esi]				;move next number into eax
	cmp		eax, [esi+4]			;compare numbers
	jg		switch					;if needs to be switched, jump there
	inc		ebx						;if no switch, add to ebx counter
	add		esi, 4
	cmp		ebx, ecx				;compare with what's left
	je		L1						;if no more numbers, loop around again
	jmp		compare

switch:
	push	eax
	push	ebx
	call	exchangeElements
	pop		ebx
	pop		eax
	pop		esi
	jmp		start

;if no switch, and at max, loop to next number to be compared
L1:
	pop		esi
	add		esi, 4
	loop	start

	pop		ebp
	ret		8
sortList ENDP





;swaps elements at current ESI position with element (assuming DWORD)
;at next position, +4 address
;receives: esi pointed to array position (must be setup before calling)
;registers changed: ebp, eax, ebx
exchangeElements PROC
	push	ebp
	mov		ebp, esp

;swap items in array
	mov		eax, [esi]				;current number
	mov		ebx, [esi+4]			;next number in array
	mov		[esi], ebx
	mov		[esi+4], eax

	pop		ebp
	ret		
exchangeElements ENDP




;displays the median in an array
;receives: array, array's total size; address of median variable
;registers affected: ebp, ebx, edx, eax
displayMedian PROC
	push	ebp
	mov		ebp, esp
	mov		ebx, 2
	mov		esi, [ebp+12]			;array

;check if list size is even or odd
	mov		edx, 0
	mov		eax, [ebp+8]			;arraySize
	cdq
	idiv	ebx
	mov		ecx, eax				;move into the counter for following loops
	cmp		edx, 0					;if 0, arraySize is even
	je		L2
;odd array
	mov		ecx, eax
	sub		ecx, 1
L1:
	add		esi, 4
	loop	L1
	mov		eax, [esi]
	jmp		continue

;even array
L2:
	add		esi, 4
	loop	L2
;if no direct median, combine two middle numbers and get average of those
	mov		eax, [esi]
	add		eax, [esi-4]
	mov		ebx, 2
	cdq
	idiv	ebx

;display the new median
continue:
	call	WriteDec

	pop		ebp
	ret		8
displayMedian ENDP




;countList: counts the number of instances for each number
;receives: address of array, array's size
;registers changed: ebp, ecx, eax, ebx, edx
countList PROC
	push	ebp
	mov		ebp, esp
	mov		esi, [ebp+20]		;array
	mov		ecx, [ebp+12]		;array's size

;count the number of similar numbers (in a sorted array)
;if it encounters a different number, copy counted items tally into next spot,
;of the countArray array then restart tally and move to next item
restart:
	mov		eax, 1
continue:
	mov		ebx, [esi]
	cmp		ebx, [esi+4]
	jne		print
	add		eax, 1
	add		esi, 4
	loop	continue
	jmp		finish
print:

	push	[ebp+16]			;countArray
	push	[ebp+8]				;cArraySize
	push	eax					;number to add to array
	call	addToList

	add		esi, 4
	loop	restart

finish:
	pop		ebp
	ret		16
countList ENDP



addToList PROC
	push	ebp
	mov		ebp, esp

	mov		esi, [countArray]		;countArray
	mov		eax, 5				;number to be added
	mov		ecx, cArraySize		;cArraySize

	cmp		ecx, 0
	jz		finish
;get to spot in array to add
L1:
	add		esi, 4
	loop	L1

;add number to spot in countArray
finish:

	mov		[esi], eax


;add one to the size of our cArraySize
	
	inc cArraySize

mov eax, [esi]
call writedec
call crlf


	pop		ebp
	ret		12
addToList ENDP

END main

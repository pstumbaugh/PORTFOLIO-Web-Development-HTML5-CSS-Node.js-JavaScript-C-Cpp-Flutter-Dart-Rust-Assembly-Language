TITLE Composites     (Project4.asm)

; Author: Patrick Stumbaugh

; Description: Calculate composite numbers using procedures and loops

INCLUDE Irvine32.inc

HLIMIT = +400
LLIMIT = +1

.data
EC1		BYTE "**EC1: Align the output columns.",0
EC2		BYTE "**EC2: Display more composites",0
greet	BYTE "Composite Numbers programmed by Pat Stumbaugh",0
intro	BYTE "Enter the number of composite numbers you would like to see.",0
intro2	BYTE "I'll accept orders for up to 400 composites.", 0
ask		BYTE "Enter the number of composites to display [1 .. 400]: ",0
error	BYTE "Out of range. Try again.",0
goodbye	BYTE "Results certified by Pat Stumbaugh. Goodbye.",0
extra	BYTE "Would you like to see another ten composite numbers?",0
entry	BYTE "Type 1 for yes, 0 for no: ",0
spaces	BYTE "    ",0
space	BYTE " ",0
user	DWORD ?
checkN	DWORD 0 ;0 will indicate true, 1 will indicate false (for user check)
number	DWORD 4 ;starting at the first composite positive number
ten		DWORD 10
divisor	DWORD 1

.code
main PROC

;displays intro and greeting
	call	introduction

;displays extra credit
	mov		edx, OFFSET EC1
	call	WriteString
	call	CrLf
	mov		edx, OFFSET EC2
	call	WriteString
	call	CrLf
	call	CrLf

;gets user data / checks to see if it's in range
;(tried using stack for this call)
	push	OFFSET checkN
	push	OFFSET user
	call	getUserData

;displays user amount of composite numbers
	call	showComposites

;asks if user wants to see more composites
	call	ExtraCredit2

;displays goodbye message
	call	farewell

	exit	; exit to operating system
main ENDP



;-----------------------PROCEDURES-----------------------------

;displays the intro and greeting statement
;receive: nothing
;registers changed: edx, ebp
introduction PROC
	push	ebp
	mov		ebp, esp

	mov		edx, OFFSET greet
	call	WriteString
	call	CrLf
	call	CrLf

	mov		edx, OFFSET intro
	call	WriteString
	call	CrLf
	mov		edx, OFFSET intro2
	call	WriteString
	call	CrLf
	call	CrLf

	pop		ebp
	ret
introduction ENDP




;----------------------------------------------------------------------------
;prompts and gets user's number (stores in "user" variable)
;receives: offset user (user's number address), offset checkN
;registers changed: eax, ebx, edx, ebp
getUserData PROC
	push	ebp
	mov		ebp, esp

getUserNum:
	;dispaly call message
	mov		eax, [ebp+12]			;checkN
	mov		ebx, 0					;reset checkN to 0
	mov		[eax], ebx
	mov		edx, OFFSET ask
	call	WriteString

	;read the integer from the user, store in ebx
	mov		ebx, [ebp+8]			;user
	call	ReadInt
	mov		[ebx],eax

	;push the user number and the checkN, call checkRange
	push	[ebp+12]				;checkN
	push	[ebp+8]					;user
	call	validate				;call sub-procedure

	;see if checkN variable is still 0 (indicating user number
	;is within range. If true, continue on, if false, start over from top
	mov		ebx, [ebp+12]
	mov		eax, [ebx]
	mov		ebx, 0
	cmp		eax, ebx
	jnz		getUserNum

	pop		ebp
	ret		8
getUserData ENDP




;----------------------------------------------------------------------------
;checks the user's number to our specified range
;receives: offset user, offset checkN
;registers affected: eax, ebx, ebp
validate PROC
	push	ebp
	mov		ebp, esp

	;check upper limit
	mov		eax, [ebp+8]			;move address of user into eax
	mov		eax, [eax]				;move value of user into eax
	mov		ebx, HLIMIT		
	cmp		eax, ebx
	jg		outOfRange				;jump to error if greater than upper limit

	;check lower limit
	mov		eax, [ebp+8]			;move address of user into eax
	mov		eax, [eax]				;move value of user into eax
	mov		ebx, LLIMIT		
	cmp		eax, ebx
	jge		continue				;jump to continue if above lower limit

	;display out of range message, change checkN to 1 (indicating false)
	;I'm using 1 as a fault and 0 as a true message in the main
outOfRange:
	mov		edx, OFFSET error
	call	WriteString
	call	CrLf
	mov		eax, [ebp+12]
	mov		ebx, 1
	mov		[eax], ebx

continue:
	pop		ebp
	ret		8
validate ENDP




;----------------------------------------------------------------------------
;displays all the composite numbers up through the user's number
;makes a new line every ten numbers displayed
;received: nothing
;registers affected: ebx, ecx, ebp
showComposites PROC
	push	ebp
	mov		ebp, esp
	call	CrLf

	mov		ten, 10					;numbers per line counter
	mov		ecx, user				;user number used for loop

L1:
	pushad							;save registers to stack
	call isComposite				;call sub-procedure
	popad							;bring back registers from stack

;subtracts 1 from our ten counter. If 0, make a new line, if not, loop back
	sub		ten, 1
	mov		ebx, ten
	cmp		ebx, 0
	jz		resetTen
	loop	L1						;**uses LOOP to decrement ecx

;resets the line counter back to ten
;if the loop counter (ecx) is at 0, then jump to finish
resetTen:
	mov		ten, 10
	call	CrLf
	mov		ebx, ecx
	cmp		ebx, 0
	jz		continue
	loop	L1						;**uses LOOP to decrement ecx

continue:
	pop		ebp
	ret		
showComposites ENDP




;----------------------------------------------------------------------------
;finds the next composite number, displays it
;receives: nothing
;registers affected: eax, ebx, edx, ebp
isComposite PROC
	push	ebp
	mov		ebp, esp

;sets up starting variables
	mov		eax, number				;number will be last number tried
	mov		divisor, 1				;sets our starting divisor to 1
	mov		ebx, 0					;used to count number of divisions
	jmp		L1

;resets divisor, ebx counter and increments number
reset:
	inc		number
	mov		eax, number
	mov		divisor, 1
	mov		ebx, 0

;compares our current number to the divisor
L1:
	mov		edx, 0
	mov		eax, number
	cdq
	idiv	divisor
;if no remainder (found a clean division), jump to foundDivision
;otherwise increment divisor and try again
;if divisor is equal to the number, jump to reset loop
	cmp		edx, 0
	jz		foundDivision
	inc		divisor
	mov		eax, number
	cmp		eax, divisor
	je		reset
	jmp		L1

foundDivision:
	inc		ebx
	cmp		ebx, 2					;if divisable by 2+ #'s (it's composite)
	je		foundComposite
	inc		divisor
	mov		eax, number
	cmp		divisor, eax
	je		reset
	jmp		L1

;composite number found, display it, add one (for next time called) and return
foundComposite:
	mov		eax, number
	cmp		eax, 100
	jge		more1
	mov		edx, OFFSET space
	call	WriteString
more1:
	mov		eax, number
	cmp		eax, 10
	jge		more
	mov		edx, OFFSET space
	call	WriteString
more:
	mov		edx, OFFSET spaces
	call	WriteString
	mov		eax, number
	call	WriteDec
	inc		number
	jmp		continue




continue:
	pop		ebp
	ret		
isComposite ENDP




;----------------------------------------------------------------------------
;Displays goodbye message
;receives: nothing
;registers affected: edx, ebp
farewell PROC
	push	ebp
	mov		ebp, esp

	call	CrLf
	mov		edx, OFFSET goodbye
	call	WriteString
	call	CrLf

	pop		ebp
	ret
farewell ENDP




;----------------------------------------------------------------------------
;Displays another line of composites (extra credit 2)
;receives: nothing
;registers affected: ebp, edx
ExtraCredit2 PROC
	push	ebp
	mov		ebp, esp

;ask if user wants another ten numbers
L1:
	call	CrLf
	mov		edx, OFFSET extra
	call	WriteString
	call	CrLf
	mov		edx, OFFSET entry
	call	WriteString
	call	ReadInt
	cmp		eax, 1
	jne		continue

	mov		user, 10				;adds ten to our previous user number
	call showComposites				;displays another ten composites
	jmp L1


continue:
	pop		ebp
	ret
ExtraCredit2 ENDP





END main

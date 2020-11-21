TITLE Fibonacci     (Project2.asm)
                                                                                
; Author: Patrick Stumbaugh

; Description: Calculating Fibonacci numbers

INCLUDE Irvine32.inc

; constant definitions
LOW_END		= 1
HIGH_END	= 46

.data
; variable definitions
pro_title	BYTE	"Fibonacci Numbers",0
my_name		BYTE	"Programmed by Patrick Stumbuagh",0
ask_name	BYTE	"What is your name? ",0
hello		BYTE	"Hello, ",0
intro_1		BYTE	"Enter the number of Fibonacci terms to be displayed.",0
intro_2		BYTE	"Give the number as an integer in the range [1 .. 46]: ",0
ask_terms	BYTE	"How many Fibonacci terms do you want? ",0
OOR_error	BYTE	"Out of range",0
OOR_error2	BYTE	"Your number is out of range."
			BYTE	0dh,0ah
			BYTE	"Would you like to try again?",0
OOR_error3	BYTE	"Enter a number in [1 .. 46]",0
results_by	BYTE	"Results certified by Patrick Stumbaugh",0
goodbye		BYTE	"Goodbye, ",0
EC1			BYTE	"**EC: Display the numbers in aligned columns.",0
EC2			BYTE	"**EC: Do something incredible: Display pop up"
			BYTE	" message if user term is out of bounds",0
space		DWORD	"    ",0
user_name	DWORD	100 DUP(0)
terms		DWORD	?
result1		DWORD	0
result2		DWORD	1
columns		DWORD	5

.code
main PROC

; introduce program name and title (also show extra credit display)
	mov		edx, OFFSET pro_title
	call	WriteString
	call	CrLf
	mov		edx, OFFSET my_name
	call	WriteString
	call	CrLf
	call	CrLf
	mov		edx, OFFSET EC2
	call	WriteString
	call	CrLf
	call	CrLf

; get user's name
	mov		edx, OFFSET ask_name
	call	WriteString
	mov		edx, OFFSET user_name
	mov		ecx, SIZEOF	user_name
	call	ReadString				; storing the user's name in: user_name
	mov		edx, OFFSET hello
	call	WriteString
	mov		edx, OFFSET user_name
	call	WriteString
	call	CrLf

; prompt and get number of fibonacci numbers wanted
	mov		edx, OFFSET intro_1
	call	WriteString
	call	CrLf
	mov		edx, OFFSET intro_2
	call	WriteString
	call	CrLf
	mov		edx, OFFSET ask_terms
	call	WriteString	
	call	ReadInt
	mov		terms, eax
	jmp		check_terms				; jump pask re_ask if first time asking

; if user input is out of bounds, a message box will appear
; it will ask if the user wants to continue. If yes, prompt for a new number
; if no, go to finish2 and exit program
re_ask:
	mov		ebx, OFFSET OOR_error
	mov		edx, OFFSET OOR_error2
	call	MsgBoxAsk
	cmp		eax, 6
	jnz		finish2
	mov		edx, OFFSET OOR_error3
	call	WriteString
	call	CrLf
	mov		edx, OFFSET ask_terms
	call	WriteString
	call	ReadInt
	mov		terms, eax

check_terms:
; check if user input is within bounds
	mov		eax, terms
	cmp		eax, LOW_END
	jl		re_ask					; if lower than 1, re-ask for terms
	mov		eax, terms
	cmp		eax, HIGH_END
	jg		re_ask					; if greater than 46, re-ask for terms
	mov		ecx, terms			
	; if terms is acceptable, add it to the ecx register


; do fibonacci calculations:
; add last result + current result
; update variables holding previous and current results
; display the current sum
; loop back around and do it again, if ecx counter is still greater than 0
L1:
	mov		ebx, result2			; current number
	mov		eax, result1			; previous number
	add		eax, ebx
	mov		ebx, result2
	mov		result1, ebx
	mov		result2, eax
	call	WriteDec
	mov		edx, OFFSET space
	call	WriteString
;subtract one from columns // if out of columns, 
;start new line and reset columns
	mov		ebx, 1
	mov		eax, columns
	sub		eax, ebx
	mov		columns, eax
	cmp		eax, 0
	jnz		continueL1
	call	Crlf
	mov		eax, 5
	mov		columns, eax
continueL1:
	LOOP	L1	

; display goodbye messages
	call	CrLf
	call	CrLf
	mov		edx, OFFSET results_by
	call	WriteString
	call	CrLf
finish2:
	mov		edx, OFFSET goodbye
	call	WriteString
	mov		edx, OFFSET user_name
	call	WriteString
	call	CrLf


	exit	; exit to operating system
main ENDP

END main

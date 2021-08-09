"""CS 362, Group Project
Philip Beck
Jaime Justo
Patrick Stumbaugh
"""
from conv_num_helpers import data_type


def conv_num(num_str: str):
    """
    Takes in a string representation of a number and converts it into its
    base 10 form. If the string's form is invalid, it returns None.

    Parameters:
        num_str (str): string representation of a number.

    Returns:
        if num_str represents a valid type: returns it in numerical format.
        if num_str represents an invalid type: returns None.
    """
    # check if input is a valid data type
    num_type = data_type(num_str)

    # not a valid data type
    if num_type == "invalid":
        return None

    # base 16 for converting hex, base 10 for converting int and float
    base = 16 if num_type == "hex" else 10

    # allowed characters
    allowed_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                     'A', 'B', 'C', 'D', 'E', 'F']

    i = len(num_str) - 1                # index starts at end of string
    power = 0                           # power for base
    base10_format = 0                   # resulting base 10 number

    # flag for negative sign
    negative = True if num_str[0] == '-' else False

    # initialize starting while loop variable
    digit = num_str[i].upper()

    # parse string in reverse until hex prefix or negative encountered
    while (i >= 0) and (digit != '-') and (digit != 'X'):
        if (digit == '.'):
            base10_format /= 10**power          # make int a float
            power = 0                           # reset power
        else:
            # index position from allowed_chars is the value of the digit
            int_value = allowed_chars.index(digit)

            # calculation for base 10 value
            base10_format += int_value * (base**power)
            power += 1

        # get next digit
        i -= 1
        digit = num_str[i].upper()

    # make result negative
    if negative:
        base10_format *= -1

    return base10_format


def my_datetime(num_sec):
    """ Function takes an integer of seconds and returns a string of the
    date from epoch (Jan. 1, 1970). Takes into account leap years. Assumes
    no negative integers are submitted """

    ''' initialize variables '''
    month = 0
    leap_days = 0
    index = 0
    leap_year_flag = 0
    # Array to store the number of days per month in a "normal" year
    days_in_months_array = [31, 28, 31, 30, 31, 30,
                            31, 31, 30, 31, 30, 31]
    # Setup our base epoch year (Jan. 1, 1970)
    year = 1970
    # Setup our days by the number of seconds given.
    # 86400 = seconds in one day
    day = num_sec // 86400

    ''' get the number of years since epoch time, based on our number of
    days. Adjust both day and year. '''
    day, month, year = get_year(day, year)

    ''' use leftover days and add 1 to include Jan 1, 1970 day'''
    leap_days = day + 1

    ''' if the current year (the ending year) is also a leap year, raise a
    leap_year_flag to check later'''
    leap_year_flag = check_for_leap_year(year)

    ''' Get the month and day (already have year)'''
    # if the leap_year_flag is raised, assume the year is a leap year
    if leap_year_flag == 1:
        while True:
            # if our month index is correct, check if it's Feb 29th
            if index == 1:
                if leap_days - 29 < 0:
                    break
                month += 1
                leap_days -= 29
            # else go to the next month and subtract the checked month's
            # number of days
            else:
                if leap_days - days_in_months_array[index] < 0:
                    break
                month += 1
                leap_days -= days_in_months_array[index]
            index += 1
    # else if not a leap year, simply find the day and month
    else:
        while True:
            # Loop until we find the day correctly landing within a month
            # if index is out of range (date in previous year), adjust
            if index >= 12:
                break
            elif leap_days - days_in_months_array[index] < 0:
                break
            month += 1
            leap_days -= days_in_months_array[index]
            index += 1

    ''' Get the day. If it is a leap year, adjust day and month accordingly '''
    day, month = get_day(month, leap_days, leap_year_flag,
                         days_in_months_array)

    ''' Return our date as a string '''
    return get_final_string_date(month, day, year)


def get_day(month, leap_days, leap_year_flag, days_in_months_array):
    """ Sub function of my_datetime to calculate if day is in a leap year
    and lands on Feb. 29th. If there are remaining leap days, add 1 to our
    month and reset our day variable to leap_days, else check if it's a leap
    day, if not, assume it's the last day of the previous month """
    if leap_days > 0:
        month += 1
        day = leap_days
    else:
        # if it is the leap year AND Feb 29th, set as so
        if month == 2 and leap_year_flag == 1:
            day = 29
        else:
            day = days_in_months_array[month - 1]
    return day, month


def get_year(day, year):
    """ Sub function of my_datetime to check if a year is a leap year. It
    then will adjust days in that year accordingly. Returns both day and
    year. """
    cross_over_year_flag = 0
    while day >= 365:
        if check_for_leap_year(year) == 1:
            day -= 366
            if day < 0:
                cross_over_year_flag = 1
                break
        else:
            day -= 365
            if day < 0:
                cross_over_year_flag = 1
                break
        year += 1

    # if the days cross back over into the year before, change the month
    if cross_over_year_flag == 1:
        month = 12
    else:
        month = 0

    return day, month, year


def check_for_leap_year(year):
    """ Sub function of my_datetime to check if passed year (int) is a leap
    year """
    if (year % 400 == 0 or
            (year % 4 == 0 and
             year % 100 != 0)):
        return 1
    return 0


def get_final_string_date(month, day, year):
    """ Sub function of my_datetime to convert all numbers to strings. """
    final_date = ""
    # if the days are single digit, add a 0 to the front of it
    if day <= 9:
        string_days = "0" + str(day)
    else:
        string_days = str(day)

    # if the months are single digit, add a 0 to the front of it
    if month <= 9:
        string_months = "0" + str(month)
    else:
        string_months = str(month)

    string_year = str(year)

    '''add all together for the final date'''
    final_date = string_months + "-" + string_days + "-" + string_year

    # Return the time
    return final_date


def conv_endian(num: int, endian='big') -> str:
    """Takes integer input as num and converts to hexadecimal number
    Must be able to handle negative values for num
    A value of 'big' for endian will return big-endian hex
    A value of 'little' for endian will return little-endian hex
    Any other values of endian will return None
    The returned string will have each byte separated by a space
    Each byte must be two characters in length
    """
    if endian != 'big' and endian != 'little':
        return None

    # Initialize starting values
    conv_hex = []
    conv_hex_str = ''
    result = abs(num)
    hex_dec_dict = {10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'}

    # Build bytes in little-endian list
    while result > 0:
        remainder = result % 16
        if remainder in hex_dec_dict:
            remainder = hex_dec_dict[remainder]
        conv_hex_str = str(remainder) + conv_hex_str
        if len(conv_hex_str) == 2:
            conv_hex.append(conv_hex_str)
            conv_hex_str = ''
        result = result // 16

    # Handle lone leading hex digit
    if len(conv_hex_str) == 1:
        conv_hex_str = '0' + conv_hex_str
        conv_hex.append(conv_hex_str)

    # Build return string
    conv_hex_str = conv_hex.pop(0)
    for byte in conv_hex:
        if endian == 'big':
            conv_hex_str = byte + ' ' + conv_hex_str
        else:
            conv_hex_str = conv_hex_str + ' ' + byte

    # Handle negative values
    if num < 0:
        conv_hex_str = '-' + conv_hex_str

    return conv_hex_str

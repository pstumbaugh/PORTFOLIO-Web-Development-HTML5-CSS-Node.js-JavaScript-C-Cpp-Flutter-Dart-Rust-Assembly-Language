def check_negative(str_num: str) -> bool:
    """
    Checks if a string begins with a negative.
    Parameters:
        str_num (str): string representation of a number.
    Returns:
        True if string begins with negative, otherwise False.
    """
    if (str_num[0] == '-'):
        return True
    return False


def check_hex_prefix(str_num: str, has_negative: bool) -> bool:
    """
    Checks if a string has a hexadecimal prefix.
    Parameters:
        str_num (str): string representation of a number.
        has_negative (bool): indicates if str_num contains a negative.
    Returns:
        True if string contains the prefix 0x or 0X, otherwise False.
    """
    hex_prefixes = ['0x', '0X']

    # check for hex prefix
    if (len(str_num) > 2 and str_num[:2] in hex_prefixes):
        return True

    # check for hex prefix after a negative sign
    if ((len(str_num) > 3 and has_negative) and str_num[1:3] in hex_prefixes):
        return True

    return False


def valid_data_type(has_decimal, has_hex_prefix) -> str:
    """
    Returns the data type of a string based on the boolean values of the flags
    has_decimal and has_hex_prefix.
    Assumes the string represents a valid data type (int, float, hex).
    Parameters:
        has_decimal (str): True == string contains a decimal.
        has_hex_prefix (str): True == string contains a hex prefix
    """
    if has_decimal:
        return "float"
    elif has_hex_prefix:
        return "hex"
    else:
        return "int"


def validate_char(num, has_hex_prefix, has_negative, has_decimal) -> bool:
    """
    Checks if num is allowed based on arguments provided.

    Returns:
        True if num is valid, otherwise False.
    """
    # allowed characters
    allowed_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                     'A', 'B', 'C', 'D', 'E', 'F', '.']

    # contains illegal character
    if (num not in allowed_chars):
        return False

    # contains alpha without hexadecimal prefix
    if (num.isalpha() and has_hex_prefix is False):
        return False

    # contains multiple decimal points or hex has decimal
    if ((has_decimal or has_hex_prefix) and num == '.'):
        return False

    # contains negative in wrong location
    if (has_negative and num == '-'):
        return False

    return True


def data_type(str_num: str) -> str:
    """
    Parses a string representation of a number and checks if it is a
    valid number type (int, float, hex).
    Parameters:
        str_num (str): string representation of a number.
    Returns:
        "invalid" if invalid format.
        "int" if int format.
        "float" if float format.
        "hex" if hex format.
    """
    # input is not of type string or is empty
    if (type(str_num) != str or len(str_num) == 0):
        return "invalid"

    input_length = len(str_num)     # length of input

    # input only has 1 character and its not an integer
    first_char = ord(str_num[0])
    if (input_length == 1 and (first_char < 48 or 57 < first_char)):
        return "invalid"

    has_decimal = False                         # contains decimal flag
    negative = check_negative(str_num)          # flag for negative symbol
    hex_prefix = check_hex_prefix(str_num, negative)    # flag for hex prefix
    start = 0                                # where to start in the string

    # contains negative
    if negative:
        start = 1

    # contains hex prefix
    if hex_prefix:
        start = 2
        # also contains negative
        if negative:
            start = 3

    # parse the string for invalid characters
    for i in range(start, input_length):
        # treat lowercase characters as uppercase
        num = str_num[i].upper()

        # check if character is legal
        valid_char = validate_char(num, hex_prefix, negative, has_decimal)
        if valid_char is False:
            return "invalid"

        # contains a decimal point
        elif (num == '.'):
            has_decimal = True

    return valid_data_type(has_decimal, hex_prefix)

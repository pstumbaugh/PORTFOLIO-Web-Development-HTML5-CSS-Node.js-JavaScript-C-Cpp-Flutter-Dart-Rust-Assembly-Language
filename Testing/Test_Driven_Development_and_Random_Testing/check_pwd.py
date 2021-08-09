# Patrick Stumbaugh

def check_pwd(password):
    # check for length of password
    if len(password) < 8 or len(password) > 20:
        return False

    # check for lowercase letter in password
    lower_char_flag = False
    # iterate through each char in password looking for lowercase chars
    for char in password:
        test_char = char.islower()
        # if one is found, change flag and break (no need to continue)
        if test_char:
            lower_char_flag = True
            break
    if not lower_char_flag:
        return False

    # check for uppercase letter in password
    upper_char_flag = False
    # iterate through each char in password looking for uppercase chars
    for char in password:
        test_char = char.isupper()
        # if one is found, change flag and break (no need to continue)
        if test_char:
            upper_char_flag = True
            break
    if not upper_char_flag:
        return False

    # check for at least one digit in password
    digit_char_flag = False
    # iterate through each char in password looking for any number
    for char in password:
        test_char = char.isdigit()
        # if one is found, change flag and break (no need to continue)
        if test_char:
            digit_char_flag = True
            break
    if not digit_char_flag:
        return False

    # check for at least one special character in password (~`!@#$%^&*()_+-=)
    special_char_flag = False
    special_list = "~`!@#$%^&*()_+-="
    # iterate through each char in password looking for any special char
    for char in password:
        # check each char in password compared to our special char list
        for test_char in special_list:
            if test_char == char:
                special_char_flag = True
                break
        if special_char_flag:
            break
    if not special_char_flag:
        return False

    return True

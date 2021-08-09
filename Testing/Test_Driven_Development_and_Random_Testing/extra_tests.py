import random
import string

# random tests that fulfill all requirements
# code adapted from:
# https://www.geeksforgeeks.org/generating-strong-password-using-python/
def test8(self):
    for i in range(0, 10000):
        length = random.randint(8, 20)

        # set up our required items
        lower = string.ascii_lowercase
        upper = string.ascii_uppercase
        num = string.digits
        symbol_set = "~`!@#$%^&*()_+-="
        combined_list = lower + upper + num + symbol_set

        # randomly select at least one character from each character set
        # above
        rand_digit = random.choice(num)
        rand_upper = random.choice(upper)
        rand_lower = random.choice(lower)
        rand_symbol = random.choice(symbol_set)

        # temp password to get the minimum items required in
        password = rand_digit + rand_upper + rand_lower + rand_symbol

        # add characters randomly to fill in the rest of the password
        for x in range(length - 4):
            password = password + random.choice(combined_list)

        expected = True
        self.assertEqual(check_pwd(password), expected)


# random tests that are too short
# code adapted from:
# https://www.geeksforgeeks.org/generating-strong-password-using-python/
def test9(self):
    for i in range(0, 100):
        length = random.randint(0, 7)

        # set up our required items
        lower = string.ascii_lowercase
        upper = string.ascii_uppercase
        num = string.digits
        symbol_set = "~`!@#$%^&*()_+-="
        combined_list = lower + upper + num + symbol_set

        # randomly select at least one character from each character set
        # above
        rand_digit = random.choice(num)
        rand_upper = random.choice(upper)
        rand_lower = random.choice(lower)
        rand_symbol = random.choice(symbol_set)

        # temp password to get the minimum items required in
        password = rand_digit + rand_upper + rand_lower + rand_symbol

        # add characters randomly to fill in the rest of the password
        for x in range(length - 4):
            password = password + random.choice(combined_list)

        expected = False
        self.assertEqual(check_pwd(password), expected)
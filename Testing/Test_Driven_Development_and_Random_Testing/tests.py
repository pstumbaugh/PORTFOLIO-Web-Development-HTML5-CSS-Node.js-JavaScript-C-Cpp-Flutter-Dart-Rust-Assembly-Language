import string
import unittest
import random
from check_pwd import check_pwd


class TestCase(unittest.TestCase):
    pass

    # check if empty password is rejected correctly
    def test1(self):
        password = ""
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # check if password less than 8 characters is rejected correctly
    def test2(self):
        password = "1234567"
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # check if password more than 20 characters is rejected correctly
    def test3(self):
        password = "123456789123456789123"
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # check if password contains at least one lower case character
    def test4(self):
        password = "12345678910"
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # check if password contains at least one upper case character
    def test5(self):
        password = "12345678910a"
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # check if password contains at least one digit
    def test6(self):
        password = "ThisPasswordIsBad"
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # check if password contains at least one special symbol (~`!@#$%^&*()_+-=)
    def test7(self):
        password = "MissingSpecialSym55"
        expected = False
        self.assertEqual(check_pwd(password), expected)

    # random tests that fulfill all requirements
    # code adapted from:
    # https://www.geeksforgeeks.org/generating-strong-password-using-python/
    def test8(self):
        for counter_1 in range(0, 10000):
            length = random.randint(8, 20)

            # create the password to test
            password = password_generator(length)

            expected = True
            self.assertEqual(check_pwd(password), expected)

    # random tests that are too short
    # code adapted from:
    # https://www.geeksforgeeks.org/generating-strong-password-using-python/
    def test9(self):
        for counter_2 in range(0, 100):
            length = random.randint(0, 7)

            # create the password to test
            password = password_generator(length)
            expected = False
            self.assertEqual(check_pwd(password), expected)


if __name__ == '__main__':
    unittest.main()


def password_generator(length):
    """Generates a password using lowercase, uppercase, numbers and special
    symbols. Function will fill in up through size length."""
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

    return password

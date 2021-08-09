import unittest
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


if __name__ == '__main__':
    unittest.main()

import datetime
import random
import unittest
from task import my_datetime, get_final_string_date
from task import conv_endian
from task import conv_num


class TestCase(unittest.TestCase):

    # Check negative sign properly attached
    def test1_endian(self):
        self.assertEqual(conv_endian(-11), '-0B')

    # Check for single-digit values
    def test2_endian(self):
        self.assertEqual(conv_endian(1), '01')

    # Check for big-endian notation
    def test3_endian(self):
        self.assertEqual(conv_endian(-259, 'big'), '-01 03')

    # Check for implied big-endian notation
    def test4_endian(self):
        self.assertEqual(conv_endian(259), '01 03')

    # Check for little-endian notation
    def test5_endian(self):
        self.assertEqual(conv_endian(-954786, 'little'), '-A2 91 0E')

    # Check for exact multiples of 16
    def test6_endian(self):
        self.assertEqual(conv_endian(256, 'big'), '01 00')

    # Check for invalid endian
    def test7_endian(self):
        self.assertIsNone(conv_endian(-259, 'hamster'))

    # Check for zero in leading byte
    def test8_endian(self):
        self.assertEqual(conv_endian(954786, 'big'), '0E 91 A2')

    # testing for initial date (0 seconds)
    def test1_my_datetime(self):
        expected = "01-01-1970"
        self.assertEqual(my_datetime(0), expected)

    # testing for random future date
    def test2_my_datetime(self):
        expected = "11-29-1973"
        self.assertEqual(my_datetime(123456789), expected)

    # testing for random future date
    def test3_my_datetime(self):
        expected = "12-22-2282"
        self.assertEqual(my_datetime(9876543210), expected)

    # testing for a leap year and date hitting Feb 29th
    def test4_my_datetime(self):
        expected = "02-29-8360"
        self.assertEqual(my_datetime(201653971200), expected)

    # testing for all 9's in seconds
    def test5_my_datetime(self):
        expected = "09-27-33658"
        self.assertEqual(my_datetime(999999999999), expected)

    # testing for a leap year and date hitting Feb 29th
    def test6_my_datetime(self):
        expected = "02-29-2396"
        self.assertEqual(my_datetime(13448393192), expected)

    # testing for a leap year and date hitting Feb 29th
    def test7_my_datetime(self):
        expected = "02-29-5688"
        self.assertEqual(my_datetime(117333938792), expected)

    # testing for a leap year and date hitting day before leap day
    def test8_my_datetime(self):
        expected = "02-28-8888"
        self.assertEqual(my_datetime(218316098792), expected)

    # testing for a leap year and date hitting day after leap day
    def test9_my_datetime(self):
        expected = "03-01-8888"
        self.assertEqual(my_datetime(218316271592), expected)

    # testing for missing leading 0 in day (should not equal)
    def test10_my_datetime(self):
        expected = "03-1-8888"
        self.assertNotEqual(my_datetime(218316271592), expected)

    # testing for missing leading 0 in month (should not equal)
    def test11_my_datetime(self):
        expected = "3-01-8888"
        self.assertNotEqual(my_datetime(218316271592), expected)

    # testing for missing leading 0 in month and day (should not equal)
    def test12_my_datetime(self):
        expected = "3-1-8888"
        self.assertNotEqual(my_datetime(218316271592), expected)

    # testing for exactly one second after first day
    def test13_my_datetime(self):
        expected = "01-02-1970"
        self.assertEqual(my_datetime(86400), expected)

    # testing for exactly one second before end of first day
    def test14_my_datetime(self):
        expected = "01-01-1970"
        self.assertEqual(my_datetime(86399), expected)

    # testing for skipped leap year (not every 4 years is a leap year,
    # to adjust for extra time. 2100 is one of those non-leap-year leap
    # years. So instead of Feb. 29th 2100, it should skip to 3/1/2100
    def test15_my_datetime(self):
        expected = "02-29-2100"
        self.assertNotEqual(my_datetime(4107602792), expected)

    # checks for last day of the year (Dec. 31st)
    def test16_my_datetime(self):
        expected = "12-31-2098"
        self.assertEqual(my_datetime(4070882792), expected)

    # checks for first day of the year (Jan. 1st)
    def test17_my_datetime(self):
        expected = "01-01-2099"
        self.assertEqual(my_datetime(4070969192), expected)

    # checks for last day of year before leap year (Dec. 31st)
    def test18_my_datetime(self):
        expected = "12-31-2103"
        self.assertEqual(my_datetime(4228562792), expected)

    # checks for last day of a leap year (Dec. 31st)
    def test19_my_datetime(self):
        expected = "12-31-2104"
        self.assertEqual(my_datetime(4260185192), expected)

    # checks for first day of a leap year (Jan. 1st)
    def test20_my_datetime(self):
        expected = "01-01-2104"
        self.assertEqual(my_datetime(4228649192), expected)

    # testing for random day in february, non-leap year
    def test21_my_datetime(self):
        expected = "02-28-4565"
        self.assertEqual(my_datetime(81895424554), expected)

    # testing for max year of 9999
    def test22_my_datetime(self):
        expected = "12-31-9999"
        self.assertEqual(my_datetime(253402287921), expected)

    # using datetime, pick a random number of seconds and compare to
    # my_datetime function to check equal
    # 253402287921 is max for datetime (gives max year of 9999).
    def test23_my_datetime_random(self):
        counter = 1
        while counter <= 2000:
            random_number = random.randint(0, 253402287921)
            date_from_current_time = datetime.datetime.utcfromtimestamp(
                random_number)
            string_date = get_final_string_date(
                date_from_current_time.month, date_from_current_time.day,
                date_from_current_time.year)
            self.assertEqual(my_datetime(random_number), string_date)
            counter += 1

    # Check that conv_num rejects strings with multiple decimal points
    def test1_conv_num(self):
        self.assertIsNone(conv_num('12.3.45'))

    # Check that conv_num rejects strings with alpha characters that aren't
    # part of a hexadecimal number
    def test2_conv_num(self):
        self.assertIsNone(conv_num('12345A'))

    # Check that conv_num rejects strings with alpha characters that aren't
    # part of a hexadecimal number
    def test3_conv_num(self):
        self.assertIsNone(conv_num('0xAZ4'))

    # Check that conv_num rejects strings with negative symbols in the wrong
    # location
    def test4_conv_num(self):
        self.assertIsNone(conv_num('-123-45'))

    # Check that conv_num rejects strings with decimals in hexadecimal numbers
    def test5_conv_num(self):
        self.assertIsNone(conv_num('0xAD.32'))

    # Check that conv_num rejects input that aren't strings
    def test6_conv_num(self):
        self.assertIsNone(conv_num(1234))

    # Check that conv_num rejects empty strings
    def test7_conv_num(self):
        self.assertIsNone(conv_num(""))

    # Check that conv_num returns a value of type int when passed
    # its string representation
    def test8_conv_num(self):
        result = conv_num('9123832')
        self.assertEqual(type(result), int)

    # Check that conv_num returns the correct integer when passed
    # its string representation
    def test9_conv_num(self):
        self.assertEqual(conv_num('-823238'), -823238)

    # Check that conv_num returns the correct integer when passed
    # a hexadecimal representation
    def test10_conv_num(self):
        self.assertEqual(conv_num('0xAD4'), 2772)

    # Check that conv_num returns the correct integer when passed
    # a hexadecimal represenation
    def test11_conv_num(self):
        self.assertEqual(conv_num('-0xADF2'), -44530)

    # Check that conv_num returns a value of type float when passed
    # its float representation
    def test12_conv_num(self):
        result = conv_num('929.732')
        self.assertEqual(type(result), float)

    # Check that conv_num returns the correct floating point number
    # when passed its float representation
    def test13_conv_num(self):
        self.assertEqual(conv_num('-2334.3214'), -2334.3214)


if __name__ == '__main__':
    unittest.main()

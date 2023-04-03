
from utils import validate_input
import pytest


def test_validate_email():
    correct_data = 'test@test.com'
    wrong_data_1 = 'test.com'
    wrong_data_2 = 'test@test'
    assert validate_input.validate_email(correct_data)['valid'] == True
    assert validate_input.validate_email(wrong_data_1)['valid'] == False
    assert validate_input.validate_email(wrong_data_2)['valid'] == False


def test_validate_password():
    correct_data = '123456aA'
    wrong_data_1 = '12345aA'
    wrong_data_2 = '12345A'
    wrong_data_3 = '12345a'
    wrong_data_4 = 'Aabbccddee'
    assert validate_input.validate_password(correct_data)['valid'] == True
    assert validate_input.validate_password(wrong_data_1)['valid'] == False
    assert validate_input.validate_password(wrong_data_2)['valid'] == False
    assert validate_input.validate_password(wrong_data_3)['valid'] == False
    assert validate_input.validate_password(wrong_data_4)['valid'] == False

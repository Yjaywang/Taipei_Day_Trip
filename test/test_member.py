import pytest
from application import create_app
import json
from werkzeug.http import parse_cookie
import requests
app = create_app()

# log in


def test_put_sign_in_correct():
    url = '/api/user/auth'
    correct_data = {
        "email": "test10@test.com",
        "password": "123456789aA"
    }
    response = app.test_client().put(url, json=correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['ok'] == True
    assert 'access_token_cookie' in response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in response.headers.get_all(
        'Set-Cookie')[2]


def test_put_sign_in_wrong():
    url = '/api/user/auth'

    wrong_data_1 = {
        "email": "",
        "password": "123456789aA"
    }
    response = app.test_client().put(url, json=wrong_data_1)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['message'] == 'input empty values'

    wrong_data_2 = {
        "email": "test10@test.com",
        "password": ""
    }
    response = app.test_client().put(url, json=wrong_data_2)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['message'] == 'input empty values'

    wrong_data_3 = {
        "email": "test10@test.com",
        "password": "123456789"
    }
    response = app.test_client().put(url, json=wrong_data_3)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['message'] == 'wrong password, try again!'

    wrong_data_4 = {
        "email": "tesrrrrrrrrt10@test.com",
        "password": "123456789"
    }
    response = app.test_client().put(url, json=wrong_data_4)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['message'] == 'email not existed'


# get user information
def test_get_user_correct():
    client = app.test_client()
    url = '/api/user/auth'
    correct_data = {
        "email": "test10@test.com",
        "password": "123456789aA"
    }
    auth_response = client.put(url, json=correct_data)
    assert 'access_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[2]
    cookie_header = auth_response.headers.get('Set-Cookie')
    cookies = parse_cookie(cookie_header).get('access_token_cookie')
    # set access token cookie
    client.set_cookie('localhost', 'access_token_cookie', cookies)

    response = client.get(url)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['data']['email'] == 'test10@test.com'


# log out
def test_sign_out_correct():
    client = app.test_client()
    url = '/api/user/auth'
    correct_data = {
        "email": "test10@test.com",
        "password": "123456789aA"
    }
    auth_response = client.put(url, json=correct_data)
    assert 'access_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[2]
    cookie_header = auth_response.headers.get('Set-Cookie')
    cookies = parse_cookie(cookie_header).get('access_token_cookie')
    # set access token cookie

    client.set_cookie('localhost', 'access_token_cookie', cookies)

    response = client.delete(url)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert 'access_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[0]
    assert 'refresh_token_cookie' in auth_response.headers.get_all(
        'Set-Cookie')[2]

import pytest
from application import create_app
import json
app = create_app()

# attraction by ID


def test_get_attraction_byID_correct():
    correct_data = '/api/attraction/1'

    response = app.test_client().get(correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['data']['name'] == '新北投溫泉區'


def test_get_attraction_byID_wrong():
    wrong_data_1 = '/api/attraction/100'
    wrong_data_2 = '/api/attraction/a'

    response = app.test_client().get(wrong_data_1)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['message'] == '景點編號不正確'

    response = app.test_client().get(wrong_data_2)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 400
    assert data['error'] == True

# attractions


def test_get_attractions_correct():
    correct_data_1 = '/api/attractions?page=0'
    correct_data_2 = '/api/attractions?page=0&keyword=台北探索館'

    response = app.test_client().get(correct_data_1)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['nextPage'] == 1

    response = app.test_client().get(correct_data_2)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['data'][0]['name'] == '台北探索館'


def test_get_attractions_null():
    null_data = '/api/attractions?page=10'

    response = app.test_client().get(null_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['data'] == []


def test_get_attractions_wrong():
    wrong_data = '/api/attractions?page=a'

    response = app.test_client().get(wrong_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 500
    assert data['error'] == True


def test_get_categories_correct():
    correct_data = '/api/categories'

    response = app.test_client().get(correct_data)
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['data'] == [
        "養生溫泉",
        "藍色公路",
        "歷史建築",
        "藝文館所",
        "單車遊蹤",
        "戶外踏青",
        "宗教信仰",
        "其　　他",
        "親子共遊"
    ]

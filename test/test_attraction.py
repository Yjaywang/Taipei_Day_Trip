import pytest
from application import create_app
import json
app = create_app()


def test_get_attraction_byID():
    response = app.test_client().get('/api/attraction/1')
    data = json.loads(response.data.decode('utf-8'))
    assert response.status_code == 200
    assert data['data']['name'] == '新北投溫泉區'

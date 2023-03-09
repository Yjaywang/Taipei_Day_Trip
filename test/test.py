import pytest
from application import create_app


@pytest.fixture()
def app():
    app = create_app()
    app.run(host="0.0.0.0", port=3000)
    # with app.app_context():
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()

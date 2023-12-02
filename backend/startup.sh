#!/bin/bash
python3 manage.py collectstatic --no-input && gunicorn --workers 2 backend.wsgi && touch __init__.py
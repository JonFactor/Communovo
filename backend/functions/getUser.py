from rest_framework.exceptions import AuthenticationFailed
import jwt
from users.models import User
import unicodedata

def getUser(request):
    
    token = request.COOKIES.get('jwt')
    
    if token == None:
        return None
    if "=" in token:
        token = token.split("=")[0]
    if ";" in token:
        token = token.split(";")[1]

    if not token:
        raise AuthenticationFailed('Unauthenticated')
        
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('jwt expired signature')

    return User.objects.filter(id=payload['id']).first()
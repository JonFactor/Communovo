from django.core.mail import EmailMessage
from sms import send_sms
from googlevoice import Voice
from twilio.rest import Client
# from googlevoice import Voice

class Util:
    @staticmethod
    def SendEmail(data):
        email = EmailMessage(
            subject=data['emailSubject'], body=data['emailBody'], to=data['emailTo'], from_email="communovoapp@gmail.com"
        )
        email.send()
    
    @staticmethod
    def SendSMS(number, message):
        account_sid = 'AC7419928e770d2a5045a91656e403fa36'
        auth_token = '3921c91e53be452867fa92e43c968005'
        client = Client(account_sid, auth_token)

        messages = client.messages.create(
        from_='+18336583627',
        body=message,
        to="+1" + number.replace("-", "")
        )

        if messages.status == "queued":
            return True
        
        # voice.send_sms(phoneNumber, text)
        return False
        # number = number.replace("-", "")
        # sent = send_sms(message,"+18143853288",  ["+1" + number])
        # print(sent)
        # return sent
        # user = 'jon.factor2@gmail.com'
        # password = 'VBBG9DAa1'
        
        # voice = Voice()
        # voice.login(user, password)
        # voice.send_sms(number, message)
        # return True
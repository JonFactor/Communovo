from django.core.mail import EmailMessage

class Util:
    @staticmethod
    def SendEmail(data):
        email = EmailMessage(
            subject=data['emailSubject'], body=data['emailBody'], to=data['emailTo'], from_email="communovoapp@gmail.com"
        )
        email.send()
        
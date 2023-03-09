import boto3
from botocore.client import Config

ACCESS_KEY="AKIAWAQKPPP4QYGILJ7O"
SECRET_KEY="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"

s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
                  aws_secret_access_key=SECRET_KEY,
                  config=Config(signature_version='s3v4'))


# with open(r"D:\Users\88698\Desktop\CIRCL_traceline\1111.png", 'rb') as f:
#     s3.upload_fileobj(f, 'taipei-day-trip-jaywang', 'image.jpg')






# url = s3.generate_presigned_url(
#     ClientMethod='get_object',
#     Params={
#         'Bucket': 'taipei-day-trip-jaywang',
#         'Key': 'image.jpg',
#         "ResponseContentType": 'image/png,image/jpeg,image/bmp,image/gif'
#     }
# )

# print(url)  # This will print the URL of the image
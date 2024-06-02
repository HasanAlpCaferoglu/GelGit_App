import json
import sys
import logging
import pymysql
import os

"""
The code creates the connection to your database outside of the handler function. 
Creating the connection in the initialization code allows the connection to be 
re-used by subsequent invocations of your function and improves performance. 
"""

# rds settings
user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
rds_proxy_host = os.environ['RDS_PROXY_HOST']
db_name = os.environ['DB_NAME']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# create the database connection outside of the handler to allow connections to be
# re-used by subsequent function invocations.
try:
    conn = pymysql.connect(host=rds_proxy_host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit(1)

logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")


def lambda_handler(event, context):
 
    # TODO implement
    print("Hiiiiiiii !!!!!!")
    # get info from event
    data = event
    email = data['email']

    # some example SQL commands
    with conn.cursor() as cursor:

        cursor.execute('SELECT * FROM User WHERE email = %s ', (email, ))
        accountExistWithSameEmail = cursor.fetchone()

        if not email:
            message = 'Please fill out the email!'
        else:
            cursor.execute('INSERT INTO User (id, email, password, phone, active) VALUES (NULL, % s, % s, % s, TRUE)', (email, password, phone, ))
            conn.commit()

        logger.info(message)
    
    conn.commit()

    return {
        'statusCode': 200,  # Customizing the status code
        'body': json.dumps({
            'message': message,  # Including custom message in the response body
            'email': email,  # Including email for reference
            'some_other_data': 'value',  # Including additional data
        })
    }

from birdy.twitter import AppClient
import urllib.parse
import json


from constants import CONSTANTS
from secrets import SECRETS

def make_report(keywords, date):
    client = AppClient(SECRETS['CONSUMER_KEY'],
                    SECRETS['CONSUMER_SECRET'])
    client.get_access_token()
    or_together_keywords = urllib.parse.quote(keywords.replace(',',' OR '))
    # response = client.make_api_call('GET','https://api.twitter.com/1.1/search/tweets.json',data=or_together_keywords)
    response = client.api.search.tweets.get(q=or_together_keywords)
    print(json.dumps(response.data))

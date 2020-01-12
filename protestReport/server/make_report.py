from birdy.twitter import AppClient
import urllib.parse
import json
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from constants import CONSTANTS
from secrets import SECRETS
  
def make_report(keywords, date, location, radius):
  

def make_single_report(keywords, date, location, radius):
  rawTweets = talk_to_twitter(keywords, location, radius).statuses
  analyzer = SentimentIntensityAnalyzer()
  report = []
  for tweet in rawTweets:
    vs = analyzer.polarity_scores(tweet.text)
    simplifiedTweet = {""}
    report.append()
    vs['compound']

def talk_to_twitter(keywords, location):
    client = AppClient(SECRETS['CONSUMER_KEY'],
                    SECRETS['CONSUMER_SECRET'])
    client.get_access_token()
    or_together_keywords = urllib.parse.quote(keywords.replace(',',' OR '))
    query = or_together_keywords + CONSTANTS['APPEND_TO_TWITTER_REQUEST']
    
    locationString =  
    response = client.api.search.tweets.get(q=query, count=CONSTANTS['MAX_NUM_RESULTS'])
    #print(json.dumps(response.data))
    return response.data

make_report('dad,mom',5)

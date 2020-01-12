from birdy.twitter import AppClient
import urllib.parse
import json
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from constants import CONSTANTS
from secrets import SECRETS

class Report:
  def __init__(self):
    self.percentPositive = None
    self.percentNegative = None
    self.totalSum = None

  

def make_report(keywords, date):
  report = Report()
  allTweets = talk_to_twitter(keywords)
  allText = [t.text for t in allTweets.statuses]
  analyzer = SentimentIntensityAnalyzer()
  totalSum, positivePoints, negativePoints, neutralPoints = 0, 0, 0, 0 
  for tweet in allText:
    vs = analyzer.polarity_scores(tweet)
    totalSum += vs['compound']
    if (vs['compound'] >= 0.05):
      positivePoints += 1
    if (vs['compound'] <= 0.05):
      negativePoints += 1
    else :
      neutralPoints += 1
  
  report.percentPositive = 100 * (positivePoints / (positivePoints + negativePoints + neutralPoints))
  report.percentNegative = 100 * (negativePoints / (positivePoints + negativePoints + neutralPoints))
  report.totalSum = totalSum
  print(
    "%d %% tweets were positive\n%d %% tweets were negative\nwith a total summed positivity of %d" % (report.percentPositive, report.percentNegative, report.totalSum))
        

def talk_to_twitter(keywords):
    client = AppClient(SECRETS['CONSUMER_KEY'],
                    SECRETS['CONSUMER_SECRET'])
    client.get_access_token()
    or_together_keywords = urllib.parse.quote(keywords.replace(',',' OR '))
    response = client.api.search.tweets.get(q=or_together_keywords, count=100)
    #print(json.dumps(response.data))
    return response.data

make_report('dad,mom',5)

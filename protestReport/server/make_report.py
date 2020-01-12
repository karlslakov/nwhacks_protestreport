from birdy.twitter import AppClient, ApiComponent
import json
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from constants import CONSTANTS
from secrets import SECRETS
import datetime

DATE_RANGE_HALF = datetime.timedelta(days=13)
RADII = [5, 25, -1]
RESULTS_PER_BATCH = 500
MAX_BATCHES = 1

client = AppClient(SECRETS['CONSUMER_KEY'],
                SECRETS['CONSUMER_SECRET'])
client.get_access_token()

def make_report(keywords, date_string, latitude, longitude):
    date = datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ')
    date_start = date - DATE_RANGE_HALF
    date_end = date + DATE_RANGE_HALF
    or_together_keywords = keywords.replace(',',' OR ')

    result = {}

    for r in RADII:
        key = "rad" + str(r) if r != -1 else "global"
        result[key] = make_single_report(or_together_keywords, date_start, date_end, latitude, longitude, r)

    print(result)
    return result

def make_single_report(keywords, date_start, date_end, latitude, longitude, radius):
    rawTweets = talk_to_twitter(keywords, date_start, date_end, latitude, longitude, radius)
    analyzer = SentimentIntensityAnalyzer()
    report = []
    for tweet in rawTweets:
        vs = analyzer.polarity_scores(tweet.text)
        simplifiedTweet = {
            "sentiment_info": vs,
            "text": tweet.text,
            "date": tweet.created_at,
            "loc": tweet.coordinates,
        }
        report.append(simplifiedTweet)
    return report

def talk_to_twitter(keywords, date_start, date_end, latitude, longitude, radius):
    locationString =  '%f %f %dkm' % (longitude, latitude, radius)
    query = "point_radius:[%s] %s" % (locationString, keywords) if radius != -1 else "%s" % keywords
    datestart_string = date_start.strftime("%Y%m%d%H%M")
    dateend_string = date_end.strftime("%Y%m%d%H%M")
    response = ApiComponent(client.api.tweets.search, "30days").dev.get(query=query, maxResults=RESULTS_PER_BATCH, toDate=dateend_string, fromDate=datestart_string)
    all_responses = response.data.results
    batches = 1
    while batches < MAX_BATCHES:
        next_key = response.data["next"] if "next" in response.data else None
        if next_key is None:
            break
        response = ApiComponent(client.api.tweets.search, "30days").dev.get(query=query, maxResults=RESULTS_PER_BATCH, toDate=dateend_string, fromDate=datestart_string, next=next_key)
        all_responses.extend(response.data.results)        
        batches += 1
        
    return all_responses

make_report('dad,mom',"2012-05-29T19:30:03.283Z", 49.265, -123.156054)

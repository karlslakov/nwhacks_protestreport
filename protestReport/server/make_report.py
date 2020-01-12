from birdy.twitter import AppClient
import json
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from constants import CONSTANTS
from secrets import SECRETS
import datetime

DATE_RANGE_HALF = datetime.timedelta(days=1)
RADII = [5, 25, -1]
# RADII = [20]
RESULTS_PER_BATCH = 100
MAX_BATCHES = 2

client = AppClient(SECRETS['CONSUMER_KEY'],
                SECRETS['CONSUMER_SECRET'])
client.get_access_token()

def make_report2(keywords, date_string, latitude, longitude):
    import pickle
    results = None
    with open("sample_data.tweetresults", "rb") as sample_data_file:
        results = pickle.load(sample_data_file)
    return results

def make_report(keywords, date_string, latitude, longitude):
    date = datetime.datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ')
    date_start = date - DATE_RANGE_HALF
    date_end = date + DATE_RANGE_HALF
    or_together_keywords = keywords.replace(',',' OR ')

    result = {}

    for r in RADII:
        key = "rad" + str(r) if r != -1 else "global"
        result[key] = make_single_report(or_together_keywords, date_start, date_end, latitude, longitude, r)
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
    locationString =  '%s %s %dkm' % (longitude, latitude, radius)
    query = "point_radius:[%s] %s" % (locationString, keywords) if radius != -1 else "%s" % keywords
    datestart_string = date_start.strftime("%Y%m%d%H%M")
    dateend_string = date_end.strftime("%Y%m%d%H%M")
    response = client.api.tweets.search["30day"].dev.get(query=query, maxResults=RESULTS_PER_BATCH, toDate=dateend_string, fromDate=datestart_string)
    all_responses = response.data.results
      
    response = client.api.tweets.search["30day"].dev.get(query=query, maxResults=RESULTS_PER_BATCH, toDate=datestart_string)
    all_responses.extend(response.data.results)
    # batches = 1
    # while batches < MAX_BATCHES:
    #     next_key = response.data["next"] if "next" in response.data else None
    #     if next_key is None:
    #         break
    #     response = client.api.tweets.search["30day"].dev.get(query=query, maxResults=RESULTS_PER_BATCH, toDate=dateend_string, fromDate=datestart_string, next=next_key)
    #     all_responses.extend(response.data.results)        
    #     batches += 1
        
    return all_responses

# results = make_report('new year,new year\'s eve,2020,"new year"',"2020-01-01T00:00:01.283Z", 49.265, -123.156054)
# import pickle

# with open('sample_data.tweetresults', 'wb') as sample_data_file:
#  pickle.dump(results, sample_data_file)
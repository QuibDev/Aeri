# Functions.py

import requests
import random
from requests.api import get
from emotions import *
import re



def getGif(emotion=None):

    # A function that uses the gif API to return a random gif for the given emotion among top 50

    gif = None
    emotion = emotion.strip()

    if emotion.strip() != "help":

        # set the apikey and limit
        apikey = "OEJKMMAQ1K4O"  
        lmt = 50

        # our test search        
        search_term = "anime "+emotion

        # get the top 8 GIFs for the search term
        r = requests.get(
            "https://g.tenor.com/v1/search?q=%s&key=%s&limit=%s" % (search_term, apikey, lmt))    

        if r.status_code == 200:

            data = r.json()

            # select a random gif from the top 50 results
            gif = random.choice(data["results"])
            gif = gif['media'][0]['gif']['url']           
            
    return gif

def getResponse(emotion,user):

    # A function that compiles the response message that the bot sends. 

    response = None  
    gif = None          
   

    try:
        if not emotion.strip():
            emotion = "help"
            response = random.choice(emotionResponseDict[emotion])
            gif = None

        response = random.choice(emotionResponseDict[emotion.rstrip("!").strip()])
        gif = getGif(emotion)        

    except KeyError:

        emotion = "sorry"

        response = random.choice(emotionResponseDict[emotion])
        gif = getGif(emotion)

    return response, gif

def getEmotion(message):

    # A function that detects for specific keyWords (emotions) in a message
    detectedKeyWordList = []
    message = message.content.lower().strip("!").strip("?").strip("!!").strip("!?")

    emotion = None

    for keyWord in message.split():
        if keyWord.lower() in keyWordList:
            detectedKeyWordList.append(keyWord.lower())

    try:       
        emotion = detectedKeyWordList[0]
    except IndexError:
        print("\n\nNO KEYWORD DETECTED IN THE SENTENCE:")
        print("\nMessage: {}".format(message))
        emotion = "sorry"
        return emotion



    for emotionKey in emotionMapDict:
        if emotion in emotionMapDict[emotionKey]:
            emotion = emotionKey
    
    print("\n\nMessage: {} \nDetectedEmotionKeyWordList: {} \nemotion: {}".format(message,detectedKeyWordList,emotion))

    return emotion

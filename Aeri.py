# Aeri.py


import discord
import requests
import random
from config import *
import re


client = discord.Client()

def getHelp(user):
    
    intro = "\n :sparkles: Hi! {} I'm Aeri! **[Artificial Emotion Response Interchange]** created by my creator Soda-Senpai! :heart: to spread happy emotions!\n".format(user)
    purpose = "\n:question: **My purpose** - as was told by my creator - is to convert human emotions into cute and friendly gifs! which you can favorite and share with your friends! Try it out! You might find gifs that you didn't knew existed!\n"
    use = "\n:point_right: **Here's what you can use me for!**\n" 
    help = "\n:face_with_spiral_eyes: **Aeri help** - *this brings up my command help menu.*"

    intro = intro+purpose+use+help


    greetings1 = "\n:wave: **Aeri hello** - *Use this when you want to say hi to me!*"
    greetings2 = "\n:wave: **Aeri bye** - *Use this when you want to say your good bye greeting to me. :(*"    
    greetings3 = "\n:sunny: **Aeri morning** - *use this when you want to wish good morning to Aeri!*"    
    greetings4 = "\n:last_quarter_moon_with_face: **Aeri night**- u*se this when you want to wish Aeri good night!*"

    greetings = greetings1+greetings2+greetings3+greetings4


    specials1 = "\n:blush: **Aeri headpat** - *Use this when you feel down and need a headpat from Aeri!*"
    specials2 = "\n:clap: **Aeri cheer** - *Use this when you want Aeri to cheer you up!*"
    specials3 = "\n:birthday: **Aeri wish [@user] happy birthday!** - *Use this when you want Aeri to wish a person happy birthday!*"

    specials = specials1+specials2+specials3

    outro = "\n**Discord:** https://discord.gg/RvHyYD8Ew5 \n**Website:** https://quib.dev/Aeri \n**Github:** https://github.com/quibdev/aeri  \n**PS.** *You know my creator made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*"



    response = "{} *** ~ Greetings ~ *** {} ***~ Specials ~*** {} {}".format(intro,greetings,specials,outro)

    return response

def getGif(emotion=None):

    gif = None
    emotion = emotion.strip()

    if emotion != "help":

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

    response = None  
    gif = None      

    happyBirthdayWishes = [
        "Count your life by smiles, not tears. Count your age by friends, not years. Happy birthday!"
        ,"“Happy birthday! I hope all your birthday wishes and dreams come true.”"
        ,"“A wish for you on your birthday, whatever you ask may you receive, whatever you seek may you find, whatever you wish may it be fulfilled on your birthday and always. Happy birthday!”"
        ,"“ Another adventure filled year awaits you. Welcome it by celebrating your birthday with pomp and splendor. Wishing you a very happy and fun-filled birthday!”"
        ,"“May the joy that you have spread in the past come back to you on this day. Wishing you a very happy birthday!”"
        ,"“Happy birthday! Your life is just about to pick up speed and blast off into the stratosphere. Wear a seat belt and be sure to enjoy the journey. Happy birthday!”"
        ,"“This birthday, I wish you abundant happiness and love. May all your dreams turn into reality and may lady luck visit your home today. Happy birthday to one of the sweetest people I’ve ever known.”"
        ,"“May you be gifted with life’s biggest joys and never-ending bliss. After all, you yourself are a gift to earth, so you deserve the best. Happy birthday.”"
        ,"“Count not the candles…see the lights they give. Count not the years, but the life you live. Wishing you a wonderful time ahead. Happy birthday.”"
        ,"“Forget the past; look forward to the future, for the best things are yet to come.”"
        ,"“Birthdays are a new start, a fresh beginning and a time to pursue new endeavors with new goals. Move forward with confidence and courage. You are a very special person. May today and all of your days be amazing!”"
        ,"“Your birthday is the first day of another 365-day journey. Be the shining thread in the beautiful tapestry of the world to make this year the best ever. Enjoy the ride.”"
        ,"“Be happy! Today is the day you were brought into this world to be a blessing and inspiration to the people around you! You are a wonderful person! May you be given more birthdays to fulfill all of your dreams!”"
    ]

    emotionResponseDict = {"help":[getHelp(user)]
    ,"headpat":["There there.","Coming up!","Awww there you go!"]
    ,"hello": ["Hello back! :D!","I was just thinking about you! :heart:","Hello there :D! How has been your day so far?"]
    ,"bye": ["OHH NO! ;( are you leaving already?","I see... ;<","Good bye ;D I will always be waiting for you here!"]
    ,"cheer":["You can do it Aeri trusts you! :heart:","I'm rooting for you. :D"]
    ,"night":["I wish you have happy dreams!", "Aeri wishes you a warm and good night! :>)"]
    ,"morning": ["Have a pleasant day!", "Good morning to you too! I was just thinking about you!"]
    ,"sorry": ["I'm sorry! I don't seem to have the response for this emotion right now. ;-; \nIf you want me to feel this emotion please contact my creator. \n\n**Discord**: *@OptimizedSoda* \n**Website**: **https://quib.dev/Aeri**\n**Github: https://github.com/quibdev/aeri** \n\n**PS.** *You know my creator made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*"]
    ,"happy birthday": happyBirthdayWishes,
    }    

    try:
        response = random.choice(emotionResponseDict[emotion.rstrip("!").strip()])
        gif = getGif(emotion)
    except KeyError:

        emotion = "sorry"

        response = random.choice(emotionResponseDict[emotion])
        gif = getGif(emotion)

    return response, gif


@client.event
async def on_ready():
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    print(
        f'{client.user} has connected to Discord!'
        f'{guild.name}(id:{guild.id})'
        )
        
    members = '\n -'.join([member.name for member in guild.members])
    print(f'Server Members:\n - {members}')


@client.event
async def on_message(message):
    if message.author == client.user:
        return


    # if the message mentions Aeri we proceed other wise abort -->
    if "aeri" in message.content.lower():      
      user = message.author.mention
      
      if re.search("<@(.*?)\>", message.content.lower()):

          # aeri user mention emotion -->
          mentionedUser = re.findall(" (<@.*?>)\ ",message.content.lower())[0]
          emotion = message.content.lower().split(mentionedUser)[-1]
          response, gif = getResponse(emotion,mentionedUser)

          # send response --> 
          await message.channel.send('{} {}'.format(response,mentionedUser))
          # help message would return a null gif that's why I'm checking it out
          if gif:
              await message.channel.send('{}'.format(gif))

      else:        

        # aeri self user emotion -->        
        emotion = message.content.lower().split("aeri")[1]        
        response, gif = getResponse(emotion,user)      

        # send response --> 
        await message.channel.send('{} {}'.format(response,user))
        # help message would return a null gif that's why I'm checking it out
        if gif:
            await message.channel.send('{}'.format(gif))
 


      # [debugging] this will be printed on terminal not shown to the user
      print("{} | {} | detected emotion: {}".format(message.author.display_name, message.content, emotion.strip()))                        
                      

    else:
      pass
        


client.run(TOKEN)


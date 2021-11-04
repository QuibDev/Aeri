# bot.py
import os
import discord
from dotenv import load_dotenv
import requests
import random

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
GUILD = os.getenv('DISCORD_GUILD')

client = discord.Client()

def getHelp(user):
    
    intro = "\n :sparkles: Hi! {} I'm Aeri! **[Artificial Emotion Response Interchange]** created by my creator Soda-Senpai! :heart: to spread happy emotions!\n".format(user)
    purpose = "\n:question: **My purpose** - as was told by my creator - is to convert human emotions into cute and friendly gifs! which you can favorite and share with your frineds! Try it out! You might find gifs that you didn't knew existed!\n"
    commands = "\n:point_right: **Here's what you can use me for!**\n" 
    command1 = "\n:face_with_spiral_eyes: **Aeri help** - *this brings up my command help menu.*"
    command2 = "\n:wave: **Aeri hello** - *Use this when you want to say hi to me!*"
    command3 = "\n:wave: **Aeri bye** - *Use this when you want to say your good bye greeting to me. :(*"
    command4 = "\n:blush: **Aeri headpat** - *Use this when you feel down and need a headpat from Aeri!*"
    command5 = "\n:clap: **Aeri cheer** - *Use this when you want Aeri to cheer you up!*"
    command6 = "\n:sunny: **Aeri morning** - *use this when you want to wish good morning to Aeri!*"
    command7 = "\n:last_quarter_moon_with_face: **Aeri night**- u*se this when you want to wish Aeri good night!*"

    response = intro+purpose+commands+command1+command2+command3+command4+command5+command6+command7

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

    emotionResponseDict = {"help":[getHelp(user)]
    ,"headpat":["There there.","Coming up!","Awww there you go!"]
    ,"hello": ["Hello back! :D!","I was just thinking about you! :heart:","Hello there :D! How has been your day so far?"]
    ,"bye": ["OHH NO! ;( are you leaving already?","I see... ;<","Good bye ;D I will always be waiting for you here!"]
    ,"cheer":["You can do it Aeri trusts you! :heart:","I'm rooting for you. :D"]
    ,"night":["I wish you have happy dreams!", "Aeri wishes you a warm and good night! :>)"]
    ,"morning": ["Have a pleasant day!", "Good morning to you too! I was just thinking about you!"]
    ,"sorry": ["I'm sorry! I don't seem to have the response for this emotion right now. ;-; \nIf you want me to feel this emotion please contact my creator. \n\n**Discord**: *@OptimizedSoda* \n**Website**: **https://quib.dev/Aeri**\n**Github: https://github.com/quibdev/aeri** \n\n**PS.** *You know my creator made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*"]
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
      emotion = message.content.lower().split("aeri")[1]
      response, gif = getResponse(emotion,user)

      # [debugging] this will be printed on terminal not shown to the user
      print("{} | {} | detected emotion: {}".format(message.author.display_name, message.content, emotion))                        
          
      # send response --> 
      await message.channel.send('{} {}'.format(response,user))

      # help message would return a null gif that's why I'm checking it out
      if gif:
          await message.channel.send('{}'.format(gif))

    else:
      pass
        


client.run(TOKEN)


# bot.py
import os
import discord
from dotenv import load_dotenv
import requests
import json
import random

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
GUILD = os.getenv('DISCORD_GUILD')

client = discord.Client()

def getHelp():
    
    intro = "\n Hi! I'm Aeri! Artificial Emotional Response Interface! created by my creator @Soda to spread happy emotions!\n\n"
    commands = "\n**Here's what you can use me for!**\n" 
    command1 = "\n**Aeri help!** - *this brings the command help menu.*"
    command2 = "\n**Aeri headpat!** - *use this when you feel down and need a headpat from Aeri!*"
    command3 = "\n**Aeri cheer!** - *use this when you want Aeri to cheer you up!*"
    command4 = "\n**Aeri morning!** - *use this when you want to wish good morning to Aeri!*"
    command5 = "\n**Aeri night **- u*se this when you want to wish Aeri good night!*"

    response = intro+commands+command1+command2+command3+command4+command5+command5

    return response

    

def getHeadpat():

    response = ""

    # set the apikey and limit
    apikey = "OEJKMMAQ1K4O"  # test value
    lmt = 50

    # our test search
    search_term = "anime headpats"

    # get the top 8 GIFs for the search term
    r = requests.get(
        "https://g.tenor.com/v1/search?q=%s&key=%s&limit=%s" % (search_term, apikey, lmt))    

    if r.status_code == 200:

        data = r.json()
        response = random.choice(data["results"])
        response = response['media'][0]['gif']['url']

        # get the type of the url out of it

        # load the GIFs using the urls for the smaller GIF sizes        
        #print("\ngetHeadpat response: ",response)

    return response


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

    print("Message: ", message.content)

    if message.content.lower() == "aeri help!":
        response = getHelp()       
        await message.channel.send('{}'.format(response))
        
        

    
    # headpat 
    if message.content.lower() == "aeri headpat!":
        
        # get user name ---> 
        user = message.author.display_name
        response = getHeadpat()

        # send response --> 
        await message.channel.send('There there @{}!'.format(user))
        await message.channel.send('{}'.format(response))


client.run(TOKEN)


import urllib3
import tensorflow as tf
import random
import json
import math
import sys
import uuid
import re

type = sys.argv[1];

FIRST_NAMES = ["Fahad", "Paul", "Jack", "Joe", "Ming", "Lou", "Rohan", "Ezra", "Frank", "Gopal", "Ishaq", "Preet", "Simon", "Ryan", "James", "Kinto", "Prano"]
LAST_NAMES = ["Doe", "Seraph", "Ahmad", "Ilyas", "Shams", "Chan", "Nguyen", "Jameel", "Krishnan", "Swami", "Mathews", "Aaron", "Grisham", "Noel", "Olitreu"]

threadsUrl = r"https://us-central1-hakram-tech.cloudfunctions.net/threads"
createThreadUrl = r"https://us-central1-hakram-tech.cloudfunctions.net/createThread"

postsUrl = r"https://us-central1-hakram-tech.cloudfunctions.net/posts"
createPostUrl = r"https://us-central1-hakram-tech.cloudfunctions.net/createPost"

http = urllib3.PoolManager()
one_step_model = tf.saved_model.load('alexander')

def generate_name():
    return f'{random.sample(FIRST_NAMES, 1)[0]} {random.sample(LAST_NAMES, 1)[0]}'

def generate_text(seed, length):
    states = None
    next_char = tf.constant([seed])
    result = []

    for n in range(length):
        next_char, states = one_step_model.generate_one_step(next_char, states=states)
        result.append(next_char)

    return tf.strings.join(result)[0].numpy().decode('utf-8')

def generate_post(seed, threadID):
    post_params = {
        'threadID': threadID,
        'poster': generate_name(),
        'post': generate_text(seed, 30 + random.sample(range(30), 1)[0])
    }
    http.request('GET', createPostUrl, post_params)

if (type == 'thread'):
    thread_text = generate_text(re.sub(r'\d', '', f'{uuid.uuid4().hex} {uuid.uuid4().hex} {uuid.uuid4().hex} {uuid.uuid4().hex}'), 100)

    thread_params = {
        'author': generate_name(),
        'title': thread_text
    }
    http.request('GET', createThreadUrl, thread_params)
elif (type == 'post'):
    threadsResponse = http.request('GET', threadsUrl)
    threadsObject = json.loads(threadsResponse.data.decode('utf-8'))
    if (threadsObject):
        threads = list(threadsObject)

        for _ in range(int(len(threads)/4)):
            pickedThread = random.sample(threads, 1)[0]
            posts_params = { 'threadID': pickedThread['id'] }
            postsResponse = http.request('GET', postsUrl, posts_params)
            
            seed = pickedThread['title']
            postsObject = json.loads(postsResponse.data.decode('utf-8'))
            if (postsObject):
                seed += f" #{sorted(list(postsObject.values()), key=lambda x: x['createdAt'])[-1]['post']}"
            generate_post(seed, pickedThread['id'])

    

from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
import json
import string
import random
import requests
import re
import xmltodict
from haversine import haversine

class PostText(APIView):
    def post(self, req):
        text = json.loads(req.body)['file']['base64'].split(",")[1].decode('base64')
        username = json.loads(req.body)['user']
        author = json.loads(req.body)['author']
        bookname = json.loads(req.body)['bookname']

        # print (text)
        # print (username)
        # print (author)
        # print (bookname)

        stats = {
            "wordCount": 100,
            "difficult": 20,
            "level": 2,
            "textQuality": "normal"
        }
        return Response(data={"stats": stats}, status=status.HTTP_200_OK)

class SessionStart(APIView):
    def post(self, req):
        text = json.loads(req.body)['file']['base64'].split(",")[1].decode('base64')
        username = json.loads(req.body)['user']
        author = json.loads(req.body)['author']
        bookname = json.loads(req.body)['bookname']
        
        # print (text)
        # print (username)
        # print (author)
        # print (bookname)

        return Response(data={
		"words": ['dragon',
 			  'appalling',
 			  'gentle',
 		       	  'fear',
			  'square',
			  'spread',
			  'week',
			  'flaming',
			  'autumn',
			  'volunteer',
			  'diametrically',
			  'desert',
			  'home',
			  'penetrate',
			  'copy',
			  'sapphire',
			  'child',
			  'time',
			  '_',
 			  'cycle']},
	      status=status.HTTP_200_OK)

class GetActivity(APIView):
    def post(self, req):
        text = json.loads(req.body)['file']['base64'].split(",")[1].decode('base64')
        username = json.loads(req.body)['user']
        author = json.loads(req.body)['author']
        bookname = json.loads(req.body)['bookname']
        
        # print (text)
        # print (username)
        # print (author)
        # print (bookname)

        return Response(data={
            "activity": {
                'sentences': ['but our readers already know that we may identify the\nterrible celestial ______ with our gentle friend the moon, who would not\nbe greatly flattered by the comparison.\n\n',
              'these constitute the ______.\n\n',
                'in order\nto frighten off the black ______, the natives fired shots at the\nhalf-devoured orb, accompanying their volley with the most appalling\nyells.'],
                'options': ['ebook',
                            'translator',
                            'astronomy',
                            'dragon'],
                'activityType': 1,
                'activityId': 6671}}, status=status.HTTP_200_OK)

class PostActivity(APIView):
    def post(self, req):
        text = json.loads(req.body)['file']['base64'].split(",")[1].decode('base64')
        username = json.loads(req.body)['user']
        author = json.loads(req.body)['author']
        bookname = json.loads(req.body)['bookname']
        answer = json.loads(req.body)['answer']
        previousActivity = json.loads(req.body)['activity']
        # print (text)
        # print (username)
        # print (author)
        # print (bookname)
        # print (answer)
        # print (previousActivity)
        return Response(data={"isCorrect": True}, status=status.HTTP_200_OK)




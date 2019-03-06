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
        print(json.loads(req.body))
        #Get stats
        return Response(data={"stats": "Stats Detail"}, status=status.HTTP_200_OK)

class SessionStart(APIView):
    def post(self, req):
        print(json.loads(req.body))
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
        print(json.loads(req.body))
        return Response(data={
            "activity": {
                'sentences': ['but our readers already know that we may identify the\nterrible celestial ______ with our gentle friend the moon, who would not\nbe greatly flattered by the comparison.\n\n',
              'these constitute the ______.\n\n',
                'in order\nto frighten off the black ______, the natives fired shots at the\nhalf-devoured orb, accompanying their volley with the most appalling\nyells.'],
                'options': ['ebook',
                            'translator',
                            'astronomy',
                            'dragon'],
                'activityType': 0,
                'activityId': 6671}}, status=status.HTTP_200_OK)

class PostActivity(APIView):
    def post(self, req):
        print(json.loads(req.body))
        return Response(data={"isCorrect": "response to activity"}, status=status.HTTP_200_OK)




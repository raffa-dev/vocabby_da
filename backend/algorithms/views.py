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
        return Response(data={"words": ["Learning words"]}, status=status.HTTP_200_OK)

class GetActivity(APIView):
    def post(self, req):
        print(json.loads(req.body))
        return Response(data={"activity": "activity"}, status=status.HTTP_200_OK)

class PostActivity(APIView):
    def post(self, req):
        print(json.loads(req.body))
        return Response(data={"isCorrect": "response to activity"}, status=status.HTTP_200_OK)




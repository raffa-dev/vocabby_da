import json
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView

from algo.learner import Learner
from algo.bookshelf import Bookshelf, Book


class PostText(APIView):
    def post(self, req):
        text = json.loads(req.body)['file']['base64'].split(",")[1].decode('base64')
        username = json.loads(req.body)['user']
        author = json.loads(req.body)['author']
        book_name = json.loads(req.body)['bookname']
        print (text)
        print (username)
        print (author)
        print (book_name)
        print(json.loads(req.body))

        book_shelf = Bookshelf('Library')
        book_code = book_shelf.add_book(
                text, book_name, author, 'fiction', '2000', 'ABC')
        new_book = Book.load(book_code)
        learner = Learner.load(username)
        learner.add_book(new_book)
        learner.save()

        data = {'username': username,
                'bookCode': book_code,
                'stats': new_book.stats}
        return Response(data=data, status=status.HTTP_200_OK)


class SessionStart(APIView):
    def post(self, req):
        print(json.loads(req.body))
        username = json.loads(req.body)['user']
        book_code = json.loads(req.body)['bookCode']
        learner = Learner.load(username)
        tutor = learner.get_tutor(book_code)
        session = tutor.get_session()

        data = {'username': username,
                'bookCode': book_code,
                'words': list(session.tokens.keys())}
        return Response(data=data, status=status.HTTP_200_OK)


class GetActivity(APIView):
    def post(self, req):
        print(json.loads(req.body))
        username = json.loads(req.body)['user']
        book_code = json.loads(req.body)['bookCode']
        learner = Learner.load(username)
        tutor = learner.get_tutor(book_code)
        session = tutor.get_session()
        data = {'username': username,
                'bookCode': book_code,
                'activity': session.next_acitivity()}
        return Response(data=data, status=status.HTTP_200_OK)


class PostActivity(APIView):
    def post(self, req):
        print(json.loads(req.body))
        username = json.loads(req.body)['user']
        book_code = json.loads(req.body)['bookCode']
        activity_id = json.loads(req.body)['activityId']
        selection = json.loads(req.body)['selection']
        learner = Learner.load(username)
        tutor = learner.get_tutor(book_code)
        session = tutor.get_session()
        data = {'username': username,
                'bookCode': book_code,
                'result': session.evaluate(activity_id, selection)}
        return Response(data=data, status=status.HTTP_200_OK)

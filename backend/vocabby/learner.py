"""
Module to model the user learning and logic around it.

:author: Haemanth Santhi Ponnusamy <haemanthsp@gmail.com>
"""

import pickle
import random
import numpy as np

from vocabby.bookshelf import Book


class Learner(object):
    def __init__(self, name):
        self.name = name
        self.tutors = {}

    def add_book(self, book):
        self.tutors.update({book.code: Tutor(self, book)})

    @staticmethod
    def load(learner_id):
        with open('data/learners/' + learner_id + '.p', 'rb') as learner_file:
            learner = pickle.load(learner_file)
        return learner

    def save(self):
        with open('data/learners/' + self.name + '.p', 'wb') as learner_file:
            pickle.dump(self, learner_file)

    def get_tutor(self, book_code):
        """Return the tutors corresponding to book or hire one."""

        if book_code not in self.tutors:
            book = Book.load(book_code)
            self.add_book(book)

        return self.tutors[book_code]


class Tutor(object):
    """"""
    def __init__(self, learner, book):
        self.learner = learner
        self.book = book
        self.sessions = []
        # self.mastery = {w: 0.5 for w in self.book.words}
        self.network = self.book.network

    def new_session(self):
        critical_nodes = self.get_critical_nodes()
        self.sessions.append(Session(self, critical_nodes))

    def update(self, token, response):
        sign = 1 if response else -1
        step = 0.3
        factor = 1 + (sign * step)
        self.network.node[token.root]['mastery'] = min(
                0.99,  self.network.node[token.root]['mastery'] * factor)

        for neigh in self.network.neighbors(token.root):
            weight = self.network[token.root][neigh]['weight']
            factor = 1 + (sign * step * 0.5 * weight)
            self.network.node[neigh]['mastery'] = min(
                0.99,  self.network.node[neigh]['mastery'] * factor)

    def get_critical_nodes(self):
        # TODO: Update with proper implementation
        families = list(self.book.families.keys())
        n_choice = np.random.choice(len(families), 20)
        return [self.book.families[families[i]] for i in n_choice]

    def get_session(self):
        """Returns a active/incomplete session or a new session."""
        if not(self.sessions and len(self.sessions[-1].queue)):
            self.new_session()
        return self.sessions[-1]


class Session(object):
    def __init__(self, tutor, tokens):
        self.tutor = tutor
        self.book = self.tutor.book
        self.network = self.book.network
        self.tokens = {t.root: t for t in tokens}
        self.queue = list(self.tokens.keys())
        self.answers = {}
        self.activity_cache = {}  # Prevent regeneration of new activity

    def _create_activity(self, family, activity_type):
        """"""
        if activity_type == 0:
            word = np.random.choice(family.members)
            sentences = list(
                    set(s.text.replace(word.text, '______')
                        for s in word.sentences))[:3]
            distractors = self._get_distractors(family) + [word.text]
            np.random.shuffle(distractors)
            activity_id = random.randint(1000, 100000)
            self.answers.update(
                    {activity_id:
                        {'index': distractors.index(word.text),
                         'family': family}})
            return {"sentences": sentences,
                    "options": distractors,
                    "activityType": activity_type,
                    "activityId": activity_id}

    def _get_distractors(self, family):
        return [np.random.choice(self.book.families[w].members).text
                for w, wt in self.network[family.root].items()
                if wt['weight'] < 0.8][:3]

    def _activity_selector(self):
        return 0

    def next_acitivity(self):
        if self.activity_cache:
            return self.activity_cache

        if self.queue:
            word = self.queue[0]
            activity_type = self._activity_selector()
            self.activity_cache = self._create_activity(
                 self.tokens[word], activity_type)
            return self.activity_cache
        else:
            return {'activityType': '-1'}

    def update(self, family, response):
        if family.root == self.queue[0]:
            word = self.queue.pop(0)
            if not response:
                self.queue.append(word)
            self.tutor.update(family, response)

    def evaluate(self, activity_id, selection):
        self.activity_cache = {}
        is_correct = self.answers[activity_id]['index'] == selection
        self.update(self.answers[activity_id]['family'], is_correct)
        return {'isCorrect': is_correct,
                'remaining': len(self.queue)}

"""Module to model the user learning and logic around it."""

import numpy as np
# from activity import Session


class Learner(object):
    def __init__(self, name):
        self.name = name
        self.tutors = []

    def add_book(self, book):
        self.tutors.append(Tutor(self, book))


class Tutor(object):
    """"""
    def __init__(self, learner, book):
        self.learner = learner
        self.book = book
        self.sessions = []

    def new_session(self):
        critical_nodes = self.get_critical_nodes()
        self.sessions.append(Session(self, critical_nodes))

    def update(self, token, response):
        pass

    def get_critical_nodes(self):
        # TODO: Update with proper implementation
        roots = list(self.book.roots.keys())
        n_choice = np.random.choice(len(roots), 20)
        return [self.book.roots[roots[i]] for i in n_choice]

    def load(self):
        pass

    def save(self):
        pass


class Session(object):
    def __init__(self, tutor, tokens):
        self.tutor = tutor
        self.book = self.tutor.book
        self.tokens = tokens

    def create_activity(self, token):
        self.book.vocab_net[token]
        return {"sentences": ["sentences with blanks ______", "with _____ blanks"], "options": ["a", "b"], "ActivityType": 0}

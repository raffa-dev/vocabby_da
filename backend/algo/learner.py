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
        self.graph = self.book.net.vocab_net
        self.tokens = tokens

    def create_activity(self, root, activity_type):
        word = np.random.choice(root.children)
        sentences = list(set(s.text.text.replace(word.text, '______')
                        for s in word.sentences))[:3]
        distractors = self.get_distractors(root) + [word.text]
        np.random.shuffle(distractors)
        return {"sentences": sentences,
                "options": distractors,
                "answer": word.text,
                "ActivityType": activity_type}

    def get_distractors(self, root):
        # return [np.random.choice(self.book.roots[w])
        return [w
                for w, wt in self.graph[root.word].items()
                if wt['weight'] < 0.8][:3]

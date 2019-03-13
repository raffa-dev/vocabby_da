"""Module to model the user learning and logic around it."""

import pickle
import random
import numpy as np


class Learner(object):
    def __init__(self, name):
        self.name = name
        self.tutors = []

    def add_book(self, book):
        self.tutors.append(Tutor(self, book))

    @staticmethod
    def load(learner_id):
        with open(learner_id + '.p', 'rb') as learner_file:
            learner = pickle.load(learner_file)
        return learner

    def save(self):
        with open(self.name + '.p', 'wb') as learner_file:
            pickle.dump(self, learner_file)


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
        sign = 1 if response else -1

    def get_critical_nodes(self):
        # TODO: Update with proper implementation
        roots = list(self.book.roots.keys())
        n_choice = np.random.choice(len(roots), 20)
        return [self.book.roots[roots[i]] for i in n_choice]


class Session(object):
    def __init__(self, tutor, tokens):
        self.tutor = tutor
        self.book = self.tutor.book
        self.graph = self.book.net.vocab_net
        self.tokens = {t.word: t for t in tokens}
        self.queue = list(self.tokens.keys())
        self.answers = {}

    def _create_activity(self, root, activity_type):
        """"""
        if activity_type == 0:
            word = np.random.choice(root.children)
            sentences = list(
                    set(s.text.replace(word.text, '______')
                        for s in word.sentences))[:3]
            distractors = self._get_distractors(root) + [word.text]
            np.random.shuffle(distractors)
            activity_id = random.randint(1000, 100000)
            self.answers.update(
                    {activity_id:
                        {'index': distractors.index(word.text),
                         'root': root}})
            return {"sentences": sentences,
                    "options": distractors,
                    "activityType": activity_type,
                    "activityId": activity_id}

    def _get_distractors(self, root):
        return [np.random.choice(self.book.roots[w].children).text
                for w, wt in self.graph[root.word].items()
                if wt['weight'] < 0.8][:3]

    def _activity_selector(self):
        return 0

    def next_acitivity(self):
        if self.queue:
            word = self.queue[0]
            activity_type = self._activity_selector()
            return self._create_activity(
                 self.tokens[word], activity_type)
        else:
            return {'activityType': '-1'}

    def update(self, root, response):
        word = self.queue.pop(0)
        if not response:
            self.queue.append(word)
        self.tutor.update(root, response)

    def evaluate(self, activity_id, selection):
        is_correct = self.answers[activity_id]['index'] == selection
        self.update(self.answers[activity_id]['root'], is_correct)
        return {'isCorrect': is_correct}

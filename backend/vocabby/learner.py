"""
Module to model the user learning and logic around it.

:author: Haemanth Santhi Ponnusamy <haemanthsp@gmail.com>
"""

import pickle
import random
import numpy as np

from vocabby.bookshelf import Book


class Learner(object):
    def __init__(self, name, level=3):
        self.name = name
        self.difficulty_level = level
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
                0.99, self.network.node[token.root]['mastery'] * factor)

        for neigh in self.network.neighbors(token.root):
            weight = self.network[token.root][neigh]['weight']
            factor = 1 + (sign * step * 0.5 * weight)
            self.network.node[neigh]['mastery'] = min(
                0.99,  self.network.node[neigh]['mastery'] * factor)

    def get_critical_nodes(self):
        # TODO: Update with proper implementation
        candidates = []
        for node in self.network:
            score = sum([v['weight'] for k, v in self.network[node].items()])
            candidates.append((node, score))

        # n_choice = np.random.choice(len(families), 20)
        n_choice = sorted(candidates, key=lambda x: -x[1])[:20]
        return [self.book.families[i[0]] for i in n_choice]

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
        # Prevent regeneration of new activity
        self.activity_cache = {}

    def _create_activity(self, family, activity_type):
        """"""
        if activity_type == 0:
            word = np.random.choice(family.members)
            sentences = random.shuffle(list(
                    set(s.text.replace(word.text, '______')
                        for s in word.sentences)))[:3]
            distractor_objs = self._get_distractors(family, word.pos) + [word]
            np.random.shuffle(distractor_objs)
            distractors = [d.text for d in distractor_objs]
            activity_id = random.randint(1000, 100000)
            self.answers.update(
                    {activity_id:
                        {'index': distractors.index(word.text),
                         'family': family,
                         'distractors': distractor_objs}})
            return {"sentences": sentences,
                    "options": distractors,
                    "activityType": activity_type,
                    "activityId": activity_id}

    def _get_distractors(self, family, pos):
        """Select good set of distractors"""

        candidates = {}
        for n1, attrb1 in self.network[family.root].items():
            wt1 = attrb1['weight']
            candidates.update({n1: wt1})
            for n2, attrb2 in self.network[n1].items():
                if n2 == family.root:
                    continue

                wt2 = attrb2['weight'] * wt1
                wt2 = max(candidates.get(n2, 0), wt2)
                candidates.update({n2: wt2})

        # Sort the neighbor based on context similarity
        neighbors = sorted(candidates.items(), key=lambda x: -x[1])
        return [self._select_family_member(self.book.families[w], pos)
                for w, wt in neighbors if wt < 0.8][:3]

    def _select_family_member(self, family, pos):
        """Select a word of given POS tag from family if any."""
        for word in family.members:
            if word.pos == pos:
                return word.text
        return np.random.choice(family.members)

    def _activity_selector(self):
        # TODO: Improve activity selection based on student progress
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
        result = {'isCorrect': is_correct,
                  'remaining': len(self.queue)}
        if not is_correct:
            wrong_word = self.answers[
                    activity_id]['distractors'][selection]
            feedback_sentence = random.choice(wrong_word.sentences)
            result.update({'feedback': feedback_sentence})

        return result

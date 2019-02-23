"""Module to build a structured vocabulary from text"""

import logging

import spacy
# import networkx as nx
from tqdm import tqdm
logging.basicConfig(level='INFO')


# Initialize the whole text with spacy


# Sentence class
class Sentence(object):
    """"""
    def __init__(self, sentence_text, previous_sentence):
        self.text = sentence_text
        self.next_sent = None

        if previous_sentence:
            self.prev_sent = previous_sentence
            self.prev_sent.next_sent = self


# Word - POS tuple class
class Word(object):
    """
    List of sentences: In which the word occur
    Complexity score:
    Dictionary reference:
    """
    def __init__(self, word, pos_tag):
        self.word = word
        self.pos = pos_tag
        self.sentences = []
        self.frequency = 0

    def include_sentence(self, sentence):
        self.sentences.append(sentence)
        self.frequency += 1


class Vocab:
    def __init__(self, filename):
        self.text = open(filename, encoding="ISO-8859-1").read()
        self.words = {}
        self.build()

    def _stats(self):
        """
        Most frequent 15 words
        Least frequent 15 words
        Total number of words
        Total number of words > frequency 5
        Total number of words > frequency 10
        """
        freq_list = sorted([(w.frequency, w.word, w.pos)
                            for w in self.words.values()])[::-1]

        logging.info("Most frequent 15 word tokens:")
        for w in freq_list[:15]:
            print(w)

        logging.info("Least frequent 15 word tokens:")
        for w in freq_list[-15:]:
            print(w)

        above_freq5 = sum([1 for w in freq_list if w[0] > 5])
        above_freq10 = sum([1 for w in freq_list if w[0] > 10])
        logging.info(
            "Total number of words tokens {}:".format(len(freq_list)))
        logging.info(
            "Total number of words tokens {}:".format(above_freq5))
        logging.info(
            "Total number of words tokens {}:".format(above_freq10))

    def build(self):
        """Build the vocabulary."""
        nlp = spacy.load("en_core_web_sm")
        nlp.max_length = len(self.text)
        text_obj = nlp(str(self.text.lower()), disable=['tagger', 'NER' ])
        prev_sent = Sentence('', None)
        self.clean()
        for sent in tqdm(text_obj.sents):
            curr_sent = Sentence(sent, prev_sent)
            for token in tqdm(sent):
                if token.is_stop or token.pos_ in ['PUNCT', 'SPACE']:
                    continue
                key = token.text + ' ; ' + token.pos_
                if key not in self.words:
                    self.words[key] = Word(token.text, token.pos_)
                self.words[key].include_sentence(curr_sent)
        self._stats()

    def clean(self):
        self.words = {}

    def group(self):
        """Group by family."""
        pass

    def connect(self):
        """Connect the words to form a network."""
        pass

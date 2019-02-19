"""Module to build a structured vocabulary from text"""

import spacy
# import networkx as nx
from tqdm import tqdm


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
        self.frequency = 1

    def include_sentence(self, sentence):
        self.sentences.append(sentence)
        self.frequency += 1


class Vocab:
    def __init__(self, filename):
        self.text = open(filename, encoding="ISO-8859-1").read()
        self.words = {}

    def _stats(self):
        pass

    def build(self):
        """Build the vocabulary."""
        nlp = spacy.load("en_core_web_sm")
        text_obj = nlp(str(self.text.lower()))
        prev_sent = Sentence('', None)
        for sent in tqdm(text_obj.sents):
            curr_sent = Sentence(sent, prev_sent)
            for token in tqdm(sent):
                if token.is_stop or token.pos_ in ['PUNCT', 'SPACE']:
                    continue
                key = token.text + ' ; ' + token.pos_
                if key not in self.words:
                    self.words[key] = Word(token.text, token.pos_)
                self.words[key].include_sentence(curr_sent)

    def group(self):
        """Group by family."""
        pass

    def connect(self):
        """Connect the words to form a network."""
        pass

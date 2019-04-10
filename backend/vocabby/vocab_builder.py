"""
Methods for collecting and structuring vocabulary

:author: Haemanth Santhi Ponnusamy <haemanthsp@gmail.com>
"""
import logging

import spacy
import numpy as np
import networkx as nx
from tqdm import tqdm
from numpy.linalg import norm
from spacy.lang.en.stop_words import STOP_WORDS

logging.basicConfig(level='INFO')


class Family(object):
    """
    Collective representation of a word family and its attributes.
    """
    def __init__(self, root):
        """
        **root** is root form of a word family which is of type `str`.
        """
        self.root = root
        self.members = []

    def include_member(self, new_member):
        """
        Include a new member to the family.

        **new_member** is word of type :class:`Word` class instance.
        """
        self.members.append(new_member)

    @property
    def vector(self):
        """Get collective vector representation of the family."""
        return np.mean([member.vector for member in self.members], axis=0)

    def similarity(self, neighbor):
        """Get similarity between our and the neighboring family.

        **neighbor** is a word family of type :class:`Family` class
        """
        numerator = np.dot(self.vector, neighbor.vector)
        denominator = norm(self.vector) * norm(neighbor.vector)
        return numerator / denominator


class Sentence(object):
    """
    Maintains the attributes of a sentence and also points to the adjacent
    sentences in the book.
    """
    def __init__(self, sentence_text, previous_sentence):
        """
        **sentence_text** is the raw of a sentence of type `str`.
        **previous_sentence** is the pointer to previous sentence in the book
        of type :class:`Sentence` class.
        """
        self.text = sentence_text.text
        self.next_sent = None

        # TODO: Fix sentence repetition
        if previous_sentence:
            self.prev_sent = previous_sentence
            self.prev_sent.next_sent = self


class Word(object):
    """Maintains various attributes of a word in the book."""

    def __init__(self, word):
        """
        **word** is a word token of type `spacy.token`.
        """
        self.text = word.text
        self.pos = word.pos_
        self.lemma = word.lemma_
        self.vector = word.vector
        self.sentences = []

    def include_sentence(self, sentence):
        """Include the sentence to the list of evidences for the word."""
        self.sentences.append(sentence)

    @property
    def frequency(self):
        """Get the document frequency of the word."""
        return len(self.sentences)


class Vocab:
    """Collect and organize the vocabulary from the book."""

    def __init__(self, text):
        """
        **text** is the book text for which the vocabulary has to be extracted.
        Which is of type `str`.
        """
        self.text = text
        self.words = self._collect_words()
        self.families = self._unite_family()
        self.network = self._build_network()
        self.stats()

    def fetch_word(self, word, pos_tag):
        """
        Fetch the word with respect to the query.

        **word** is orthographic form of a word, which is of type `str`.
        **pos_tag** is parts of speech tag of the word to be fetched. Which is
        of type `str`.


        **Returns** :class:`Word` instance w.r.t the orthographic form and
        the parts of speech tag.
        """
        key = word.lower() + ' ; ' + pos_tag.upper()
        return self.words.get(key, None)

    def _collect_words(self):
        """Collects all the unique word and pos_tag pairs from the text."""
        nlp = spacy.load("en_core_web_lg")

        nlp.max_length = len(self.text)
        text_obj = nlp(str(self.text.lower()), disable=['NER'])
        prev_sent = Sentence(nlp(''), None)
        words = {}
        for sent in tqdm(text_obj.sents):
            curr_sent = Sentence(sent, prev_sent)
            for token in tqdm(sent):
                if token.text in STOP_WORDS or\
                        token.pos_ in ['PUNCT', 'SPACE', 'NUM', 'SYM']:
                    continue
                key = token.text + ' ; ' + token.pos_
                if key not in words:
                    words[key] = Word(token)
                words[key].include_sentence(curr_sent)

        return words

    def _unite_family(self):
        """Unites words of same family as a single entity."""
        families = {}
        for word in self.words.values():
            if word.frequency < 4:
                continue
            key = word.lemma
            if key not in families:
                families[key] = Family(key)
            families[key].include_member(word)
        return families

    def _build_network(self):
        """Build a network between families based on context similarity."""
        weighted_adj_list = []
        families = list(self.families.keys())
        vectors = np.array([self.families[r].vector for r in families])

        # n x n cosine similarity
        logging.debug("Computing similarity")
        correlation_mat = np.dot(vectors, vectors.T)
        norms = np.linalg.norm(vectors, axis=1)
        norm_mat = np.dot(norms.reshape(-1, 1), norms.reshape(1, -1))
        self.similarity_mat = correlation_mat / norm_mat

        logging.debug(
                "Shape of correlation matrix {}".format(correlation_mat.shape))
        logging.debug("Shape of norms {}".format(norms.shape))
        logging.debug("Shape of norms matrix {}".format(norm_mat.shape))
        logging.debug(
                "Shape of sim matrix {}".format(self.similarity_mat.shape))

        # Create an adjacency list
        for i, f1 in tqdm(enumerate(families), total=len(families)):
            for j, f2 in tqdm(enumerate(families[i:]), total=len(families)-i):
                j = i + j
                if self.similarity_mat[i][j] > 0.30:
                    weighted_adj_list.append(
                           (f1, f2, self.similarity_mat[i][j]))

        network = nx.Graph()
        network.add_nodes_from(families)
        network.add_weighted_edges_from(weighted_adj_list)
        nx.set_node_attributes(network, 0.5, 'mastery')
        return network

    def stats(self):
        """Get statistics of about the collected vocabulary."""
        freq_list = sorted([(w.frequency, w.text, w.pos)
                            for w in self.words.values()])[::-1]

        logging.debug("Most frequent 15 word tokens:")
        for w in freq_list[:15]:
            print(w)

        logging.debug("Least frequent 15 word tokens:")
        for w in freq_list[-15:]:
            print(w)

        above_freq5 = sum([1 for w in freq_list if w[0] > 5])
        above_freq10 = sum([1 for w in freq_list if w[0] > 10])
        logging.debug(
                "Total number of words tokens {}:".format(len(freq_list)))
        logging.debug("Number of tokens with freq > 5 {}:".format(above_freq5))
        logging.debug(
                "Number of tokens with freq > 10 {}:".format(above_freq10))

        return {'mostFrequent': freq_list[:15],
                'leastFrequent': freq_list[-15:],
                'totalWords': len(freq_list),
                'totalAbove5': above_freq5,
                'totalAbove10': above_freq10,
                'totalFamilies': len(self.families)}

    def save_network(self, result_path):
        """Save the family network as gexf file to disk."""
        nx.write_gexf(self.network, result_path)

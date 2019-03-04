"""Module to build a graph from vocabulary."""

import os
import logging

import numpy as np
import networkx as nx
from tqdm import tqdm
from numpy.linalg import norm

from vocab import Vocab


class Root(object):
    """"""
    def __init__(self, word_root):
        self.word = word_root
        self.children = []

    def include_children(self, word):
        self.children.append(word)

    @property
    def vector(self):
        return np.mean([child.word.vector for child in self.children], axis=0)

    def similarity(self, neighbour):
        numerator = np.dot(self.vector, neighbour.vector)
        denominator = norm(self.vector) * norm(neighbour.vector)
        return numerator / denominator


class Net(object):
    """"""
    def __init__(self, text_path):
        self.vocab = Vocab(text_path)
        self.roots = {}
        self.vocab_net = nx.Graph()

        self.unite_family()
        self.build()

        filename = os.path.splitext(os.path.split(text_path)[-1])[0]
        # result_path = ('../results/graph_' + filename + '.gpickle')
        result_path_gexf = ('../results/graph_' + filename + '.gexf')
        self.save(result_path_gexf)

    def unite_family(self):
        """"""
        for word in self.vocab.words.values():
            key = word.word.lemma_
            if key not in self.roots:
                self.roots[key] = Root(key)
            self.roots[key].include_children(word)

    def build(self):
        weighted_adj_list = []
        roots = list(self.roots.keys())
        vectors = np.array([self.roots[r].vector for r in roots])

        # n x n cosine similarity
        logging.info("Computing similarity")
        correlation_mat = np.dot(vectors, vectors.T)
        logging.info("Shape of correlation matrix {}".format(correlation_mat.shape))
        norms = np.linalg.norm(vectors, axis=1)
        logging.info("Shape of norms {}".format(norms.shape))
        norm_mat = np.dot(norms.reshape(-1, 1), norms.reshape(1, -1))
        logging.info("Shape of norms matrix {}".format(norm_mat.shape))
        self.similarity_mat = correlation_mat / norm_mat
        logging.info("Shape of sim matrix {}".format(self.similarity_mat.shape))

        for i, root1 in tqdm(enumerate(roots), total=len(roots)):
            for j, root2 in tqdm(enumerate(roots[i:]), total=len(roots)-i):
                j = i + j
                if self.similarity_mat[i][j] > 0.90:
                    weighted_adj_list.append(
                           (root1,
                            root2,
                            self.similarity_mat[i][j]))
            if self.roots[root1].children:
                weighted_adj_list.extend(
                        [(root1, c.word.text, 1)
                         for c in self.roots[root1].children])

        self.vocab_net.add_weighted_edges_from(weighted_adj_list)

    def save(self, result_path):
        # nx.write_gpickle(self.vocab_net, result_path)
        nx.write_gexf(self.vocab_net, result_path)

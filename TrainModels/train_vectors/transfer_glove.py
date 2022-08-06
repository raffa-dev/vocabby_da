"""
Author: Raffael Veser

University of Tuebingen 2021
"""

import matplotlib
matplotlib.use('Agg')

from gensim.utils import SaveLoad
from gensim.models import KeyedVectors
import pickle
from gensim.models import Word2Vec
import numpy as np
import io

from gensim.models import Word2Vec
from gensim.models.word2vec import LineSentence
from gensim.models.callbacks import CallbackAny2Vec
import numpy as np
import matplotlib.pyplot as plt


class callback(CallbackAny2Vec):
    '''Callback to print loss after each epoch.'''
    
    def __init__(self):
        self.epoch = 0
        self.loss_to_be_subed = 0
        self.losses = []

    def on_epoch_end(self, model):
        loss = model.get_latest_training_loss()
        loss_now = loss - self.loss_to_be_subed
        self.loss_to_be_subed = loss
        print('Loss after epoch {}: {}'.format(self.epoch, loss_now))
        self.losses.append(loss_now)
        self.epoch += 1

        fig = plt.figure()
        plt.plot(range(len(self.losses)), self.losses)
        fig.savefig('losses.png')




def train_glove(training_data_files, outfile):
    """
    :param training_data_files: list of files which contain the sentences to learn
    :type training_data_files: list[str]
     
    """

    data = []
    
    # get contents from files
    for file in training_data_files:
    
        with io.open(file, 'r', encoding='utf-8') as fi:
            con = fi.readlines()
        
        for sen in con:
            data.append(sen.split())
            
    # make list flat
    training_data = [item for sublist in data for item in sublist]
    
    # load original vectors
    glove_vectors = KeyedVectors.load_word2vec_format("spacy_vecs_ger.txt", binary=False)

    # build a word2vec model on your dataset
    base_model = Word2Vec(size=300, min_count=1)
    base_model.build_vocab(training_data)
    total_examples = base_model.corpus_count


    # add GloVe's vocabulary & weights
    base_model.build_vocab([list(glove_vectors.vocab.keys())], update=True)
    #base_model.build_vocab([list(glove_vectors.index_to_key)], update=True)

    # lockf is a factor determining the weight of old vectors
    base_model.intersect_word2vec_format("spacy_vecs_ger.txt", binary=False, lockf=0.8)

    # train on your data
    print("Running ", base_model.epochs, "iterations")
    base_model.train(training_data, total_examples=total_examples, epochs=300,  compute_loss=True, callbacks=[callback()])
    base_model_wv = base_model.wv

    base_model.wv.save_word2vec_format(outfile, binary=False)


if __name__ == '__main__':
    train_glove(["training_data_wiki_wirtschaft.txt", "Fachwissenschaftliche-Texte-zum-Thema-Maerkte-Acrobat"], 'retrained_vectors_maerkte_wiki_epochs300_nolemmas_lockf08.txt')

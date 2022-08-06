"""
Author: Raffael Veser

University of Tuebingen 2021
"""

import wikipediaapi
import pickle
import xml.etree.ElementTree as ET
import nltk
from nltk.tokenize import RegexpTokenizer
from HanTa import HanoverTagger as ht
import numpy as np
import re
import sys


def has_numbers(inputString):
    return bool(re.search(r'\d', inputString))


def get_tokens(sentences):
    """
    Function for extracting tokens from a given text.
    Removes words that are only one character long, consist of numbers.
    
    Specific words that are found at the end of each wikipedia page are also removed
    """
    tokens = [token for token in nltk.sent_tokenize(sentences, language='german')]

    tokenizer = RegexpTokenizer(r'\w+')

    sents = [tokenizer.tokenize(sent) for sent in tokens]    
    tagger = ht.HanoverTagger('morphmodel_ger.pgz')

    training_data = []
    for i, sent in enumerate(sents):
        training_data.append([])
        for word in sent:
            if (not has_numbers(word)) and (word not in["displaystyle, cdot"]) and (len(word)>1):

                #training_data_maerkte[i].append(tagger.analyze(word)[0].lower())
                training_data[i].append(word)

    return(training_data)



"""
This contains a list of all article names affiliated with the tag "wirtschaft" obtained from petscan

To obtain a different file go to https://petscan.wmflabs.org/ where you can generate any list of 
Wikipedia Pages. The resulting file should be a collection of page names
"""


def collect_wiki(petscan_filename, file_out):
    """
    Collect all wikipedia articles and save all the texts into a single file
    """
    
    print("------ Initializing Wikicrawler ------\n") 
    with open(petscan_filename, encoding='utf-8') as fi:
        articles = fi.readlines()

    wiki_wiki = wikipediaapi.Wikipedia('de')

    training_list = np.array([])
    
    print("Downloading articles. This may take a while, please don't terminate the program\n")

    for article in articles:
        article = article.strip("\n")
        try:
            page = wiki_wiki.page(article)
        except:
            continue
        
        sentences = page.text
        
        print("Downloading:", article)
        data = get_tokens(sentences)
        data = np.array(data)
        if data.ndim != 1:
            continue
        data[data.astype(bool)]
        training_list = np.concatenate((training_list, data))

    np.save(file_out, training_list)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python get_training_data.py petscan_filename output_filename")
        
    else:
        collect_wiki(sys.argv[1], sys.argv[2])
        




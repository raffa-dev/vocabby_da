"""Utilities"""

import pandas as pd
from PyDictionary import PyDictionary

def load_freq_lookup():
    freq = pd.read_csv('../resources/subtlexus.csv')
    return {w: f for w, f in freq[['Word', 'Lg10WF']].to_numpy()}


def dictionary_lookup(word):
    dictionary = PyDictionary()
    lookup = dictionary.meaning(word)
    return list(lookup.items())
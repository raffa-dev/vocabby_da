"""Utilities"""

import pandas as pd


def load_freq_lookup():
    freq = pd.read_csv('../resources/subtlexus.csv')
    return {w: f for w, f in freq[['Word', 'Lg10WF']].to_numpy()}

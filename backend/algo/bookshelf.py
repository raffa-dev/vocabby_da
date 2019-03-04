"""Module to prepare and maintain book for vocabulary learning."""
from graph import Net


class Book:
    def __init__(self, text, title, author, gener):
        self.text = text
        self.title = title
        self.author = author
        self.gener = gener
        self.net = self._get_vocab_net()
        self.roots = self.net.roots
        self.vocab = self.net.vocab
        self.graph = self.net.vocab_net

    def _get_vocab_net(self):
        return Net(self.text)

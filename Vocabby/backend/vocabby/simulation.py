from vocabby.bookshelf import Bookshelf
from vocabby.learner import Learner

import random as rand
from tqdm import tqdm

library = Bookshelf.load('Library')
book_code = 'Libr_Game _Georg_1997_1389'
username = 'sim1'

def simulate(username, book_code, random=None):
    learner = Learner(username)
    tutor = learner.get_tutor(book_code)
    session = tutor.get_session()

    progress = tutor.progress 
    while progress <= 99: 
        session = tutor.get_session() 
        while session.queue: 
            is_correct = True if not random else rand.choices([True, False], weights=[random,1-random])[0]
            session.update(session.tokens[session.queue[0]], is_correct) 
        progress = tutor.progress 
        # print("Progress: ", progress) 
    print("Number of interactions (Ours):\t", len(tutor.sessions)*20)
    learner.save()
    return tutor


def simulate_linear_list(n, random=None):
    def update(mastery, response):
        sign = 1 if response else -1
        step = 0.3
        factor = 1 + (sign * step)
        return min(0.99, mastery * factor)

    interactions = 0 
    for _ in tqdm(range(n)):
        mastery = 0.5
        while mastery < 0.8:    
            interactions += 1
            is_correct = True if not random else rand.choices([True, False], weights=[random,1-random])[0]
            mastery = update(mastery, is_correct)
    print("Number of interactions (Linear):\t", interactions)
    return interactions
   

def compare_simulation(username, book_code, word_count, skills=[1, 0.9, 0.8, 0.7, 0.6]):
    for skill in skills:
        print("Performance with skill %s" % (skill*100))
        # simulate(username, book_code, random=skill)
        simulate_linear_list(word_count, random=skill)


def wrapper(username):
    books = [("Libr_twent_x_dx_9342", 1700), ("Libr_Harry_J. K._1996_6474", 1200), ("Libr_Game _Georg_1997_1389", 3700)]
    for book_code, word_count in books:
        print("processing book %s" % (book_code))
        compare_simulation(username, book_code, word_count)


class Simulation:
    def __init__(self) -> None:
        super().__init__()
        
    def simulate(self):
        pass
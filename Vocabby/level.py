letters = 'etaoinshrdlcumwfgypbvkjxqz'
vowels = set('aeiou')

def difficulty(word):
    unique = set(word)
    positions = sum(letters.index(c) for c in word)

    return len(word) * len(unique) * (7 - len(unique & vowels)) * positions

words = ['use', 'using', 'used', 'usable', 'user', 'pun']

for word in words:
    print(difficulty(word), word)
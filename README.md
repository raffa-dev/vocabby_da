# Vocabby
This is a vocabulary learning tool, which analyses the vocabulary structure in text and creates learning activities on the fly. This version is an adapted one, for the original one please refer to https://github.com/HaemanthSP/Vocabby. This adaption works on German texts and enables the learner to analyze domain-specific texts. Additionally the domain can be stated which changes the word vectors used in the process.

# Add Domain Vocabular

To add domain vocabular, navigate to Vocabby --> backend --> models and edit the domain_to_filenames.txt to map a keyword to the filename which it should refer to.

To create adapted models refer to the TrainModels directory

# Clone repo
```bash
git clone https://github.com/HaemanthSP/Vocabby.git
git checkout 583af3c58ed526c762a103246d491e86f7bd8dfa
```

# Setup venv
```bash
virtualenv -p /usr/bin/python3 ~/envs/vocab
source /home/hp/envs/vocab/bin/activate
```

Install dependencies,
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_lg
```


# Backend server
```bash
cd backend
python manage.py runserver 0.0.0.0:8080
```

# Frontend server
To install node,
```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"

```

to check the installation,
```
node -v
npm -v
```

then,
```
npm install npm@latest -g
```


After install node and npm. In a new terminal from root of the repo,
```bash
cd frontend
npm install
npm start
```

# App

Access the application at http://localhost:3000

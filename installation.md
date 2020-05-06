# Clone repo
```bash
git clone https://github.com/HaemanthSP/Vocabby.git
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
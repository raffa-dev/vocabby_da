import nltk
from nltk.stem import WordNetLemmatizer

def englishWords():
    with open(r'./words.txt') as word_file:
        return set(word.strip().lower() for word in word_file)  


def is_english_word(word, english_words):
    return word.lower() in english_words


def removePref(word):
    prefs = ['a','ab','abs','ac','acanth','acantho','acous','acr','acro','ad','aden','adeno','adren','adreno','aer','aero','af','ag','al','all','allo','alti','alto','am','amb','ambi','amphi','amyl','amylo','an','ana','andr','andro','anem','anemo','ant','ante','anth','anthrop','anthropo','anti','ap','api','apo','aqua','aqui','arbor','arbori','arch','archae','archaeo','arche','archeo','archi','arteri','arterio','arthr','arthro','as','aster','astr','astro','at','atmo','audio','auto','avi','az','azo','bacci','bacteri','bacterio','bar','baro','bath','batho','bathy','be','bi','biblio','bio','bis','blephar','blepharo','bracchio','brachy','brevi','bronch','bronchi','bronchio','broncho','caco','calci','cardio','carpo','cat','cata','cath','cato','cen','ceno','centi','cephal','cephalo','cerebro','cervic','cervici','cervico','chiro','chlor','chloro','chol','chole','cholo','chondr','chondri','chondro','choreo','choro','chrom','chromato','chromo','chron','chrono','chrys','chryso','circu','circum','cirr','cirri','cirro','cis','cleisto','co','cog','col','com','con','contra','cor','cosmo','counter','cranio','cruci','cry','cryo','crypt','crypto','cupro','cyst','cysti','cysto','cyt','cyto','dactyl','dactylo','de','dec','deca','deci','dek','deka','demi','dent','denti','dento','dentro','derm','dermadermo','deut','deutero','deuto','dextr','dextro','di','dia','dif','digit','digiti','dipl','diplo','dis','dodec','dodeca','dors','dorsi','dorso','dyna','dynamo','dys','e','ec','echin','echino','ect','ecto','ef','el','em','en','encephal','encephalo','end','endo','ennea','ent','enter','entero','ento','entomo','eo','ep','epi','equi','erg','ergo','erythr','erythro','ethno','eu','ex','exo','extra','febri','ferri','ferro','fibr','fibro','fissi','fluvio','for','fore','gain','galact','galacto','gam','gamo','gastr','gastri','gastro','ge','gem','gemmi','geo','geront','geronto','gloss','glosso','gluc','gluco','glyc','glyph','glypto','gon','gono','grapho','gymn','gymno','gynaec','gynaeco','gynec','gyneco','haem','haemato','haemo','hagi','hagio','hal','halo','hapl','haplo','hect','hecto','heli','helic','helico','helio','hem','hema','hemi','hemo','hepat','hepato','hept','hepta','heter','hetero','hex','hexa','hist','histo','hodo','hol','holo','hom','homeo','homo','hydr','hydro','hyet','hyeto','hygr','hygro','hyl','hylo','hymeno','hyp','hyper','hypn','hypno','hypo','hypso','hyster','hystero','iatro','ichthy','ichthyo','ig','igni','il','ile','ileo','ilio','im','in','infra','inter','intra','intro','ir','is','iso','juxta','kerat','kerato','kinesi','kineto','labio','lact','lacti','lacto','laryng','laryngo','lepto','leucleuco','leuk','leuko','lign','ligni','ligno','litho','log','logo','luni','lyo','lysi','macr','macro','magni','mal','malac','malaco','male','meg','mega','megalo','melan','melano','mero','mes','meso','met','meta','metr','metro','micr','micro','mid','mini','mis','miso','mon','mono','morph','morpho','mult','multi','my','myc','myco','myel','myelo','myo','n','naso','nati','ne','necr','necro','neo','nepho','nephr','nephro','neur','neuro','nocti','non','noso','not','noto','nycto','o','ob','oc','oct','octa','octo','ocul','oculo','odont','odonto','of','oleo','olig','oligo','ombro','omni','oneiro','ont','onto','oo','op','ophthalm','ophthalmo','ornith','ornitho','oro','orth','ortho','ossi','oste','osteo','oto','out','ov','over','ovi','ovo','oxy','pachy','palae','palaeo','pale','paleo','pan','panto','par','para','pari','path','patho','ped','pedo','pel','pent','penta','pente','per','peri','petr','petri','petro','phago','phleb','phlebo','phon','phono','phot','photo','phren','phreno','phyll','phyllo','phylo','picr','picro','piezo','pisci','plan','plano','pleur','pleuro','pluto','pluvio','pneum','pneumat','pneumato','pneumo','poly','por','post','prae','pre','preter','prim','primi','pro','pros','prot','proto','pseud','pseudo','psycho','ptero','pulmo','pur','pyo','pyr','pyro','quadr','quadri','quadru','quinque','re','recti','reni','reno','retro','rheo','rhin','rhino','rhiz','rhizo','sacchar','sacchari','sacchro','sacr','sacro','sangui','sapr','sapro','sarc','sarco','scelero','schisto','schizo','se','seba','sebo','selen','seleno','semi','septi','sero','sex','sexi','shiz','sider','sidero','sine','somat','somato','somn','sperm','sperma','spermat','spermato','spermi','spermo','spiro','stato','stauro','stell','sten','steno','stere','stereo','stom','stomo','styl','styli','stylo','sub','subter','suc','suf','sug','sum','sup','super','supra','sur','sus','sy','syl','sym','syn','tachy','taut','tauto','tel','tele','teleo','telo','terra','the','theo','therm','thermo','thromb','thrombo','topo','tox','toxi','toxo','tra','trache','tracheo','trans','tri','tris','ultra','un','undec','under','uni','up','uter','utero','vari','vario','vas','vaso','ventr','ventro','vice','with','xen','xeno','zo','zoo','zyg','zygo','zym','zymo']
    english_words = englishWords()
    for pre in prefs:
        if  word.startswith(pre):
            withoutPref = word[len(pre):]
            if is_english_word(withoutPref,english_words):
                return(withoutPref)
    return word  


sentence = "He was so unhappy and unstable and decentralized running and making out at same time. He has worst habit of disobeying and swimming after playing long hours in the Sunny day."


wordnet_lemmatizer = WordNetLemmatizer()

for item in sentence.split(" "): 
    word_new = removePref(item)

    punctuations="?:!.,;"
    sentence_words = nltk.word_tokenize(word_new)
    for word in sentence_words:
        if word in punctuations:
            sentence_words.remove(word)


    for word in sentence_words:
        print ("{0:20}{1:20}".format(item,wordnet_lemmatizer.lemmatize(word, pos="v")))


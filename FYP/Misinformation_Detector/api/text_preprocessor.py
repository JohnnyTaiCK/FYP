import nltk
from nltk import pos_tag
from nltk.corpus import stopwords
import string
from nltk import word_tokenize

class Text_Preprocessor:
    def __init__(self) -> None:
        pass

    def lower_case(self, text: str) -> str:
        return text.lower()
    
    def remove_punctuation(self, text: str) -> str:
        return "".join([char for char in text if char not in string.punctuation])

    def text_processing(self, text: str):
        lower_text = self.lower_case(text)
        text = self.remove_punctuation(lower_text)
        return text
    
    def stopword_removal(self, text: str):
        words = word_tokenize(text)
        stop_words = stopwords.words('english')
        return [word for word in words if word not in stop_words]

    def preprocess_pipe(self, texts):
        preproc_pipe = []
        
        for doc in texts:
            preproc_pipe.append(self.text_processing(str(doc)))
        return preproc_pipe


if __name__ == "__main__":
  tp = Text_Preprocessor()
  answer = tp.preprocess_pipe(["Germany is a, country in Europe."])
  print(tp.stopword_removal(answer[0]))
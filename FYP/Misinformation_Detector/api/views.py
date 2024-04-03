from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from models.flan_t5 import Flan_T5
from models.chatgpt import OpenAIModel
import torch
import itertools
from .text_preprocessor import Text_Preprocessor
from duckduckgo_search import DDGS

def ddg_search(tosearch):
    web_content = ""
    count = 1
    with DDGS(timeout=10) as ddgs:
        answer = itertools.islice(ddgs.text(f"{tosearch}", region="cn-zh",safesearch='off', max_results=5), 5)
        evi = [result['body'] for result in answer][:3]
        for result in evi:
            web_content += f"{count}. {result}\n"
            count += 1

        print("\nweb content: ", web_content)
    return web_content

class APIViewSet(viewsets.ViewSet):

    detect_model = Flan_T5()
    text_preprocessor = Text_Preprocessor() 

    def create(self,request):
        settings = request.data.get("settings")

        if settings is not None:
            if settings['model'] == 0:
                self.detect_model = Flan_T5(device=settings['load_device'])
            return Response("successfully updated model")

        input_news_title = request.data.get("title")
        input_news = request.data.get("news")

        [processed_title, processed_news] = self.text_preprocessor.preprocess_pipe([input_news_title, input_news])
        info = ""
        if processed_title != "":
            web_content = ddg_search(processed_title)
        else:
            search_keywords = self.text_preprocessor.stopword_removal(processed_news)
            if len(search_keywords) > 30:
                search_keywords = search_keywords[:30]
            web_content = ddg_search(search_keywords)
        
        f_output =  "The retrieved information from search engines is: \n{}".format(web_content)
        info = info + web_content

        # print("raw news: ",request.data.get("news"))
        # print("\n processed news title: ", processed_title)
        # print("\n processed news: ", processed_news)

        result_score = self.detect_model.answer_logics(info=f_output, gq=input_news)
        result_text = ""

        print(result_score)
        if(result_score > 0.5):
            result_text = "True"
        else:
            result_text = "False"
        return Response({'prediction': result_text, 'score': result_score})

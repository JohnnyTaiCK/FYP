from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from models.flan_t5 import Flan_T5
from models.chatgpt import OpenAIModel
import torch

from duckduckgo_search import DDGS
import itertools

def ddg_search(tosearch):
    web_content = ""
    count = 1
    with DDGS(timeout=10) as ddgs:
        answer = itertools.islice(ddgs.text(f"{tosearch}", region="cn-zh"), 5)  
        evi = [result['body'] for result in answer][:10]
        for result in evi:
            web_content += f"{count}. {result}\n"
            count += 1

        print("\nweb content: ", web_content)
    return web_content

# Create your views here.
class APIViewSet(viewsets.ViewSet):

    detect_model = Flan_T5()
    # explain_model = OpenAIModel(API_KEY="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", model_name="gpt-3.5-turbo", max_new_tokens=1000)

    def create(self,request):
        settings = request.data.get("settings")
        if settings["load_device"] != "cpu" and torch.cuda.is_available():
            self.detect_model.model.to("cuda:1")
        
        print(request.data.get("news"))
        info = ""
        web_content = ddg_search(request.data.get("news"))
        f_output =  "The retrieved information from search engines is: \n{}".format(web_content)
        info = info + web_content

        result = self.detect_model.answer_logics(info=f_output, gq=request.data.get("news"))
        result_text = ""

        print(result)
        if(result > 0.5):
            result_text = "True"
        else:
            result_text = "False"
        return Response({'prediction': result_text})

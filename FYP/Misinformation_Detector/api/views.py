from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from models.flan_t5 import Flan_T5
from models.chatgpt import OpenAIModel

# Create your views here.
class APIViewSet(viewsets.ViewSet):
    
    detect_model = Flan_T5()
   #explain_model = OpenAIModel(API_KEY="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", model_name="gpt-3.5-turbo", max_new_tokens=1000)

    def create(self,request):
        result = self.detect_model.answer_logics(info=None, gq=request.data.get("news"))
        result_text = ""

        #print(self.explain_model.chat_generate("what is the answer to 1 + 1?"))
        print(request.data.get("news"))
        print(result)
        if(result > 0.5):
            result_text = "True"
        else:
            result_text = "False"
        return Response({'prediction': result_text})
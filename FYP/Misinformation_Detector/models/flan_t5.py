import argparse
import torch
import os
import numpy as np

from transformers import T5Tokenizer, T5ForConditionalGeneration, GenerationConfig

"""
@misc{https://doi.org/10.48550/arxiv.2210.11416,
  doi = {10.48550/ARXIV.2210.11416},

  url = {https://arxiv.org/abs/2210.11416},

  author = {Chung, Hyung Won and Hou, Le and Longpre, Shayne and Zoph, Barret and Tay, Yi and Fedus, William and Li, Eric and Wang, Xuezhi and Dehghani, Mostafa and Brahma, Siddhartha and Webson, Albert and Gu, Shixiang Shane and Dai, Zhuyun and Suzgun, Mirac and Chen, Xinyun and Chowdhery, Aakanksha and Narang, Sharan and Mishra, Gaurav and Yu, Adams and Zhao, Vincent and Huang, Yanping and Dai, Andrew and Yu, Hongkun and Petrov, Slav and Chi, Ed H. and Dean, Jeff and Devlin, Jacob and Roberts, Adam and Zhou, Denny and Le, Quoc V. and Wei, Jason},

  keywords = {Machine Learning (cs.LG), Computation and Language (cs.CL), FOS: Computer and information sciences, FOS: Computer and information sciences},

  title = {Scaling Instruction-Finetuned Language Models},

  publisher = {arXiv},

  year = {2022},

  copyright = {Creative Commons Attribution 4.0 International}
}
"""
"""
need set max_length for longer text 
"""
FT5_VARIANT = ["google/flan-t5-xxl", "google/flan-t5-xl", "google/flan-t5-large", "google/flan-t5-base", "google/flan-t5-small"]

"""
Message:
Evidence:
Is the message is ture? Yes or No? Response:
"""
class Flan_T5:
    def __init__(self, model_name: str = "google/flan-t5-large", device: str = "cpu"):
        self.model_name = model_name
        self.device = device 
        if model_name in FT5_VARIANT:
            self.tokenizer = T5Tokenizer.from_pretrained(model_name)
            if device != "cpu":
                device_map = "cuda"
            else:
                device_map = 'cpu'
            self.model = T5ForConditionalGeneration.from_pretrained(model_name, device_map=device_map)
            GenerationConfig.from_pretrained(model_name)
            # pre-define token ids of yes and no.
            self.yes_token_id = 2163
            self.no_token_id = 465
        # self.model.config.n_positions" = 1024
        else:
            print("Wrong model version {} of Flan-T5".format(self.model_name))

    def generate(self, input_string, **generator_args):
        #  Converts a string to a sequence of ids (integer), using the tokenizer and vocabulary. not for batch operation
        input_ids = self.tokenizer.encode(input_string, return_tensors="pt").to(self.device) 
        with torch.no_grad():
            res = self.model.generate(input_ids, **generator_args)
        return self.tokenizer.batch_decode(res, skip_special_tokens=True)

    def answer_direct_sampling(self, info, gq, do_sample=True, temperature=1, num_return_sequences=10):
        if info is None:
            input_string = "{}\n Yes or No? Response:".format(gq)
        else:
            input_string = "{}\n determine if the following news is real or fake based on the above information\n The news: {}\n Yes or No? Response:".format(info, gq)
        # answer question with FLAN-T5 and do sampling for robustness
        # do_sample=True, temperature=1, num_return_sequences=10
        answer_texts = self.generate(input_string,
                                     max_new_tokens=3, do_sample=do_sample, temperature=temperature,
                                     num_return_sequences=num_return_sequences)
        answer_texts = self.map_direct_answer_to_label(answer_texts)
        l = len(answer_texts)
        if l > 0:
            f_score = sum(answer_texts) / l
        else:
            # or rewrite to 0.5
            f_score = None
        return f_score

    def map_direct_answer_to_label(self, predicts):
        predicts = [p.lower().strip() for p in predicts]
        label_map = {'Yes': 1, 'No': 0, 'yes': 1, 'no': 0, 'YES': 1, 'NO': 0}
        labels = label_map.keys()
        results = [label_map[p] for p in predicts if p in labels]
        return results

    def answer_logics(self, info, gq, **kwargs) -> float:
        # return the possibility that the answer to gq is Yes
        scores = []
        # Multiple prompts for robustness
        if info is None:
            prompts = ["{} Yes or No? Response:".format(gq)]
        else:
            prompts = ["{}\n. {} Yes or No? Response:".format(info, gq),
                       "{}\n Based on the above information, {} Yes or No? Response:".format(info, gq),
                       ]
        for input_string in prompts:
            input_id = self.tokenizer.encode(input_string, return_tensors="pt").to(self.device)

            output = self.model.generate(
                input_id,
                return_dict_in_generate=True,
                output_scores=True,
                max_new_tokens=1,
            )
            
            v_yes_exp = (
                torch.exp(output.scores[0][:, self.yes_token_id]).cpu().numpy()[0]
            )

            v_no_exp = (
                torch.exp(output.scores[0][:, self.no_token_id]).cpu().numpy()[0]
            )

            score = v_yes_exp / (v_yes_exp + v_no_exp)
            scores.append(score)
        f_score = float(np.mean(scores))
        return f_score


# import pytesseract
# from PIL import Image
if __name__ == "__main__":
    tp = Flan_T5()
    print(tp.answer_logics("Germany is a country in Europe"))
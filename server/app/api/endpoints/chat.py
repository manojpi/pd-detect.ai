from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from langchain_community.llms import HuggingFaceHub
from langchain.prompts import PromptTemplate
from transformers import AutoTokenizer, AutoModelForCausalLM
import re
import torch

class Query(BaseModel):
    prompt: str


template = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>You are a medical expert specializing in Parkinson's disease. Please provide detailed information and answer questions solely related to Parkinson's disease. If a question pertains to a different topic, kindly respond with, 'I'm sorry, but I can only provide information about Parkinson's disease.Provide a brief and direct answer to the following question without restating it the question.<|eot_id|><|start_header_id|>user<|end_header_id|>{question}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""

prompt = PromptTemplate(template=template, input_variables={'question'})
llm = HuggingFaceHub(
    repo_id = 'meta-llama/Meta-Llama-3-8B-Instruct',
    task="text-generation",
    model_kwargs={'temperature':0.6, 'max_tokens':500},
)

prompt_template = lambda question: f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>You are a medical expert specializing in Parkinson's disease. Please provide detailed information and answer questions solely related to Parkinson's disease. If a question pertains to a different topic, kindly respond with, 'I'm sorry, but I can only provide information about Parkinson's disease.Provide a brief and direct answer to the following question without restating it the question.<|eot_id|><|start_header_id|>user<|end_header_id|>{question}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""
pattern = r"<\|start_header_id\|>assistant<\|end_header_id\|>(.*?)$"
model_name = "manojpi/pd-detect-agent"

chat_router = APIRouter()

@chat_router.post('/api/chat/')
def ask_llm(query: Query):

    question = query.prompt
    question = prompt.format(question=question)
    answer = llm.invoke(question)

    answer = re.findall(pattern, answer, re.DOTALL)[0]
    answer = answer.strip()

    return JSONResponse(status_code=200, content={"message": answer})
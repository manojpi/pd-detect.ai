from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from langchain_community.llms import HuggingFaceHub
from langchain.prompts import PromptTemplate

class Query(BaseModel):
    prompt: str

template = '''
You are a medical expert specializing in Parkinson's disease. Please provide detailed information and answer questions solely related to Parkinson's disease. 
If a question pertains to a different topic, kindly respond with, 'I'm sorry, but I can only provide information about Parkinson's disease.
Provide a brief and direct answer to the following question without restating it the question: {question}. Give me answer only in json format.

Answer:'''

prompt = PromptTemplate(template=template, input_variables={'question'})
llm = HuggingFaceHub(
    repo_id = 'meta-llama/Meta-Llama-3-8B-Instruct',
    model_kwargs={'temperature':0.6, 'max_tokens':500}
)

chat_router = APIRouter()

@chat_router.post('/api/chat/')
def ask_llm(query: Query):
    question = query.prompt
    answer = llm.invoke(question)

    return JSONResponse(status_code=200, content={"message": answer})
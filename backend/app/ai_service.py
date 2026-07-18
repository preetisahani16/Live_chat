from openai import OpenAI
from .config import settings

INSTRUCTIONS = """You are a corporate banking support assistant. Use only supplied approved context.
Never execute transactions, request credentials, invent policy, or expose sensitive information.
Keep answers clear and under 120 words. If context is insufficient, recommend human support."""

def answer(question, item):
    if not settings.openai_api_key:
        return item["content"]
    try:
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.responses.create(
            model=settings.openai_model,
            instructions=INSTRUCTIONS,
            input=f'Approved context: {item["content"]}\nCustomer question: {question}'
        )
        return response.output_text.strip() or item["content"]
    except Exception:
        return item["content"]

import json
from aws_bedrock import ChatBotCruxy

chatbot_consult = ChatBotCruxy()


def chatbot(event, context):
    body = json.loads(event["body"])
    chat_context = body.get("chat_context")
    prompt = body.get("prompt")
    body = {
        "response": chatbot_consult.cruxy_consult(prompt, chat_context),
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps(body)
    }

import json
import boto3
import os

bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.getenv('REGION')
)

claude_basics = {
    "model_id": "anthropic.claude-3-haiku-20240307-v1:0",
    "content_type": "application/json",
    "accept": "application/json"
}


def bedrock_claude_consult_text(prompt):
    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "temperature": 0.5,
        "top_p": 0.9,
        "top_k": 50,
        "max_tokens": 10000,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    })

    response = bedrock_runtime.invoke_model(
        body=body,
        modelId=claude_basics['model_id'],
        accept=claude_basics['accept'],
        contentType=claude_basics['content_type']
    )

    return json.loads(response['body'].read()).get('content')[0]['text']

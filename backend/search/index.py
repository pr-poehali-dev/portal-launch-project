import json
import os
from typing import Dict, Any, List
from urllib.parse import quote_plus
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Выполняет реальный поиск через API DuckDuckGo
    Args: event - dict с httpMethod, queryStringParameters (query, limit)
    Returns: HTTP response с результатами поиска
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    query = params.get('query', '')
    limit = int(params.get('limit', '10'))
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Query parameter is required'})
        }
    
    try:
        ddg_url = f'https://api.duckduckgo.com/?q={quote_plus(query)}&format=json&no_html=1&skip_disambig=1'
        response = requests.get(ddg_url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        results: List[Dict[str, str]] = []
        
        if data.get('AbstractText'):
            results.append({
                'title': data.get('Heading', query),
                'url': data.get('AbstractURL', ''),
                'snippet': data.get('AbstractText', '')
            })
        
        for topic in data.get('RelatedTopics', [])[:limit-1]:
            if isinstance(topic, dict) and 'Text' in topic:
                results.append({
                    'title': topic.get('Text', '').split(' - ')[0] if ' - ' in topic.get('Text', '') else topic.get('Text', ''),
                    'url': topic.get('FirstURL', ''),
                    'snippet': topic.get('Text', '')
                })
        
        if not results:
            results = [{
                'title': f'Результаты по запросу: {query}',
                'url': f'https://duckduckgo.com/?q={quote_plus(query)}',
                'snippet': 'Не найдено конкретных результатов. Попробуйте изменить запрос.'
            }]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'results': results[:limit],
                'query': query
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Search failed: {str(e)}'})
        }

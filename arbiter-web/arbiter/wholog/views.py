import codecs
import json
import os
import time
from subprocess import Popen, PIPE, STDOUT

from django import forms
from django.core.files import File
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

from django.core import serializers
from arbiter.models import RunInfo
import requests

# 日志管理
from rest_framework.decorators import api_view

ES_URL = '10.104.104.57:9200'


def index(request):
    querybody = {
        "from": 0,
        "size": 10,
        "query": {
            "range": {
                "@timestamp": {
                    "gte": "2017-08-30T02:03:22.566Z"
                }
            }
        }
    }

    # querybody['query'] = "xxx"
    # payload = "{'query': { 'match_all': {} }}"
    res = requests.get('http://' + ES_URL + '/_search', data=json.dumps(querybody))
    data =     res.json()  # 返回的数据

    return render(request,'home.html')
@api_view(['GET'])
def search(request):
    #根据执行者查询
    author = request.GET.get('author')
    #组合查询DSL
    querybody = {
        "size":1000,
        "query": {
            "bool": {
                "must": [
                    {"match": {"author": "hui"}},
                    # {"match": {"logId": "14d037d8b0b3334f9349f0f5aaea7f90"}}
                ]
            }
        },
        "sort": {"@timestamp": {"order": "desc"}}

        }
    res = requests.get('http://' + ES_URL + '/_search', data=json.dumps(querybody))
    #转换成json
    res_json = res.json()
    #符合查询条件的数量
    result_total = res_json['hits']['total']
    #获取source节点


    result_source = res_json['hits']['hits'][0]['_source']
    #最内层数据
    response_data_dict = {}
    response_data_dict['id'] = result_source['logId']
    response_data_dict['caseName'] = result_source['case']
    response_data_dict['author'] = result_source['author']
    response_data_dict['beginTime'] = result_source['@timestamp']
    #每条返回的数据组合到list
    response_data_list = []
    #每条日志内容组合list
    log_data_list = []
    for i in range(0,result_total):
        result_source_var = res_json['hits']['hits'][i]['_source']
        print(result_source_var)
        log_data_list.append(result_source_var['logData'])

    response_data_dict['logData'] = log_data_list
    response_data_list.append(response_data_dict)
    #最终返回的json
    response_data={"data":response_data_list}
    return  JsonResponse(response_data)

@api_view(['GET'])
def getAllLog(request):
    "获取数据库所有日志列表"
    log_list = RunInfo.objects.all().order_by('run_time')
    data = serializers.serialize('json',log_list)
    return HttpResponse(data)















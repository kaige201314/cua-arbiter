from __future__ import unicode_literals

from subprocess import Popen, PIPE, STDOUT

from django.contrib import admin
from django.db import models
from django.contrib.auth.models import Group
from mongoengine import *


# Create your models here.
# case模型
class CaseList:
    @staticmethod
    def getList():
        runcmd = Popen(['nosetests', '-vvv', '--collect-only', '-w', '../arbiter-cases'], bufsize=0,
                       stdout=PIPE, stderr=STDOUT)
        log_list = []
        for line in runcmd.stdout:
            log_list.append(line.decode('utf-8').rstrip())
        # 修改显示名称
        case_list = []
        case_description_list = []
        model_list = []
        for elem in log_list:
            if elem.find("Preparing test case main") != -1:
                temp = elem.split("Preparing test case main.")[1]
                case_list.append(
                    temp[::-1].replace(".", ":", 2).replace(":", ".", 1)[::-1])
                model_list.append(temp.split(".")[1])
            elif elem.find(" ... ok") != -1:
                des_str = elem.split(" ...")[0]
                if "main.cases" in des_str:
                    des_str = des_str.split("main.cases.")[1].split(".", 1)[1]
                case_description_list.append(des_str)
        case_res = dict(zip(case_list, case_description_list))
        model_res = list(set(model_list))
        # model_res.sort(model_list.index())
        context = {'case_list': case_res, 'model_list': model_res}
        return context;

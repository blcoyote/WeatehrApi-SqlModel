from core.database import get_latest
import json
from json import JSONEncoder
from pprint import pprint
import datetime


data = get_latest(False)

print(data.json())

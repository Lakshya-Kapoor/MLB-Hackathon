from utils.config import DB_URL
from pymongo import MangoClient

def intialize_module():
    global db_clinet 
    db_clinet = MangoClient(DB_URL)


intialize_module()
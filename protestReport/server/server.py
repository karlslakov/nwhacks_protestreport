from flask import Flask, jsonify, make_response, send_from_directory
from flask import request
import os
from os.path import exists, join
from make_report import make_report
from constants import CONSTANTS


app = Flask(__name__, static_folder='build')

# Grid Page Endpoint
@app.route(CONSTANTS['ENDPOINT']['GETREPORT'], methods=["POST"])
def get_report():
    jsonobj = request.get_json()
    return make_report(jsonobj["keywords"], jsonobj["date"])

# Catching all routes
# This route is used to serve all the routes in the frontend application after deployment.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    file_to_serve = path if path and exists(join(app.static_folder, path)) else 'index.html'
    return send_from_directory(app.static_folder, file_to_serve)

# Error Handler
@app.errorhandler(404)
def page_not_found(error):
    json_response = jsonify({'error': 'Page not found'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])

if __name__ == '__main__':
    app.run(port=CONSTANTS['PORT'])

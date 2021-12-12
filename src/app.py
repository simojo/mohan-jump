from flask import Flask, render_template, send_from_directory
app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

@app.route('/', methods=['POST', 'GET'])
def main():
    return render_template('main.html')

# handling asset requests
@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('static/js', path)

@app.route('/imgs/<path:path>')
def send_imgs(path):
    return send_from_directory('static/imgs', path)

if __name__ == '__main__':
    app.run()

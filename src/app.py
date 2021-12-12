from flask import Flask, render_template
app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

@app.route('/', methods=['POST', 'GET'])
def main():
    return render_template('main.html')

# handling asset requests
@app.route('/css/<path:path>', methods=['GET'])
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>', methods=['GET'])
def send_js(path):
    return send_from_directory('js', path)

@app.route('/imgs/<path:path>', methods=['GET'])
def send_imgs(path):
    return send_from_directory('imgs', path)

if __name__ == '__main__':
    app.run()

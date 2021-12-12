from flask import Flask, render_template
app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

@app.route('/', methods=['POST', 'GET'])
def main():
    return render_template('main.html')
if __name__ == '__main__':
    app.run()
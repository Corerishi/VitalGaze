from flask import Flask, json, jsonify , render_template, request
import base64
from os import path
from subprocess import run
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/docs')
def docs():
    return render_template('docs.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/project')
def project():
    return render_template('project.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/results', methods=['POST'])
def result():
    try:
        data = request.get_json()
        if 'frameData' not in data:
            return jsonify({'error': 'Missing data!'}), 400

        frame_data = data['frameData']
        
        # Extract the actual Base64-encoded data (removing header)
        base64_data = frame_data.split(",")[1]
        
        # Decode Base64
        image_data = base64.b64decode(base64_data)
        
        # Define a file path to save the image
        file_path = path.join('../Backend/uploaded_img/', "captured_frame.jpg")
        img = path.abspath(file_path)
        main_file = path.abspath('../Backend/main.py')
        # Write decoded image to file
        with open(file_path, "wb") as f:
            f.write(image_data)
        return jsonify({'status': 'success', 'message': 'Image saved successfully!'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/output')    
def output():
    file_path = path.join('../Backend/uploaded_img/', "captured_frame.jpg")
    img = path.abspath(file_path)
    
    result = run(['python', '../Backend/main.py', '../Backend/uploaded_img/captured_frame.jpg'], capture_output=True, text=True)

    # Convert result to JSON
    json_result = result.stdout.strip()
    
    try:
        json_data = json.loads(json_result)  # Convert string to dictionary
    except json.JSONDecodeError:
        json_data = {"error": "Invalid JSON output"}  # Handle parsing errors

    return render_template('output.html', data=json_data)


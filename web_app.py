from flask import Flask, render_template, request, send_from_directory, url_for
from werkzeug.utils import secure_filename
import cv2
import numpy as np
import os
from keras.models import load_model
import matplotlib.pyplot as plt
import time
from skimage.metrics import structural_similarity as ssim
from fpdf import FPDF

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

CLASSES = [
    "open", "short", "mousebite",
    "protrusion", "copper", "pin-hole"
]

# Load the trained model
model_path = os.path.join('output', 'inceptionv3.keras')
model = load_model(model_path)

def resize_with_aspect_ratio(img, dim):
    h, w = img.shape[:2]
    new_w, new_h = dim
    if h > w:
        r = new_h / h
        dim = (int(w * r), new_h)
    else:
        r = new_w / w
        dim = (new_w, int(h * r))
    return cv2.resize(img, dim, interpolation=cv2.INTER_AREA)

def calculate_similarity(test_image_path, template_image_path):
    img_test = cv2.imread(test_image_path, cv2.IMREAD_GRAYSCALE)
    img_template = cv2.imread(template_image_path, cv2.IMREAD_GRAYSCALE)

    if img_test.shape != img_template.shape:
        img_test = cv2.resize(img_test, (img_template.shape[1], img_template.shape[0]))

    similarity_index, _ = ssim(img_test, img_template, full=True)
    similarity_percentage = similarity_index * 100

    return similarity_percentage

def assign_grade(similarity_percentage):
    if similarity_percentage >= 90:
        return "A"
    elif similarity_percentage >= 80:
        return "B"
    elif similarity_percentage >= 70:
        return "C"
    elif similarity_percentage >= 60:
        return "D"
    else:
        return "F"

def visualize_differences(test_image_path, template_image_path):
    img_test = cv2.imread(test_image_path)
    img_template = cv2.imread(template_image_path)

    if img_test.shape != img_template.shape:
        img_test = resize_with_aspect_ratio(img_test, (img_template.shape[1], img_template.shape[0]))

    difference = cv2.absdiff(img_test, img_template)
    difference_gray = cv2.cvtColor(difference, cv2.COLOR_BGR2GRAY)
    _, difference_mask = cv2.threshold(difference_gray, 30, 255, cv2.THRESH_BINARY)

    highlighted = img_test.copy()
    highlighted[difference_mask == 255] = [0, 0, 255]

    return highlighted

def generate_pdf_report(defects, similarity_percentage, grade, feedbacks, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="PCB Defect Detection Report", ln=True, align="C")
    pdf.cell(200, 10, txt=f"Similarity: {similarity_percentage:.2f}%", ln=True)
    pdf.cell(200, 10, txt=f"Grade: {grade}", ln=True)

    pdf.cell(200, 10, txt="Defects Found:", ln=True)
    for defect in defects:
        x1, y1, x2, y2, c = defect
        defect_type = CLASSES[c]
        pdf.cell(200, 10, txt=f"- {defect_type} at ({x1}, {y1}) to ({x2}, {y2})", ln=True)

    pdf.cell(200, 10, txt="Feedback:", ln=True)
    for feedback in feedbacks:
        pdf.multi_cell(0, 10, txt=feedback)

    pdf.output(output_path)

def generate_netlist_from_image(test_image_path):
    img = cv2.imread(test_image_path, cv2.IMREAD_GRAYSCALE)
    _, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    netlist = "* Generated Netlist\n"
    for i, contour in enumerate(contours):
        x, y, w, h = cv2.boundingRect(contour)
        netlist += f"R{i+1} {x} {y} {x+w} {y+h} 1k\n"

    return netlist

def generate_circuit_file(defects, test_image_path):
    netlist = generate_netlist_from_image(test_image_path)

    for defect in defects:
        x1, y1, x2, y2, c = defect
        defect_type = CLASSES[c]
        if defect_type == "open":
            netlist += f"w {x1} {y1} {x2} {y2} 0\n"
        elif defect_type == "short":
            netlist += f"R {x1} {y1} {x2} {y2} 0.1\n"

    return netlist

def process_images(test_image_path, temp_image_path):
    img_temp = cv2.imread(temp_image_path)
    img_test = cv2.imread(test_image_path)

    if img_temp.shape != img_test.shape:
        max_dim = max(img_temp.shape, img_test.shape)
        img_temp = resize_with_aspect_ratio(img_temp, max_dim[:2])
        img_test = resize_with_aspect_ratio(img_test, max_dim[:2])

    similarity_percentage = calculate_similarity(test_image_path, temp_image_path)
    grade = assign_grade(similarity_percentage)

    highlighted_diff = visualize_differences(test_image_path, temp_image_path)

    test_copy = img_test.copy()
    difference = cv2.bitwise_xor(img_test, img_temp, mask=None)
    substractGray = cv2.cvtColor(difference, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(substractGray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    test_copy[mask != 255] = [0, 255, 0]
    hsv = cv2.cvtColor(test_copy, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (36, 0, 0), (70, 255, 255))

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    opening = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    close = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=1)

    cnts = cv2.findContours(close, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    offset = 20
    predictions = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        x1 = x - offset
        x2 = x + w + offset
        y1 = y - offset
        y2 = y + h + offset
        ROI = img_test[y1:y2, x1:x2]
        try:
            ROI = cv2.resize(ROI, (224, 224))
            ROI = ROI.reshape(-1, 224, 224, 3)
            pred = model.predict(ROI)[0]
            predictions.append((x1, y1, x2, y2, pred.argmax(axis=0)))
        except cv2.error as e:
            print(f"Error processing ROI: {e}")

    return predictions, similarity_percentage, grade, highlighted_diff

def draw_defects(image_name, defects):
    img = cv2.imread(image_name)
    defect_images = {cls: img.copy() for cls in CLASSES}
    defect_counts = {cls: 0 for cls in CLASSES}
    all_defects_img = img.copy()

    for defect in defects:
        x1, y1, x2, y2, c = defect
        defect_type = CLASSES[c]
        color = (36, 255, 10)

        cv2.rectangle(all_defects_img, (x1, y1), (x2, y2), color, 2)
        cv2.putText(all_defects_img, defect_type, (x1, y1), 0, 1, (180, 40, 100), 2, cv2.LINE_AA)

        cv2.rectangle(defect_images[defect_type], (x1, y1), (x2, y2), color, 2)
        cv2.putText(defect_images[defect_type], defect_type, (x1, y1), 0, 1, (180, 40, 100), 2, cv2.LINE_AA)
        defect_counts[defect_type] += 1

    return all_defects_img, defect_images, defect_counts

def generate_feedback(defect_counts):
    feedbacks = []
    for defect_type, count in defect_counts.items():
        if count > 0:
            feedback = generate_defect_feedback(defect_type, count)
            feedbacks.append(feedback)
    return feedbacks

def generate_defect_feedback(defect_type, count):
    feedbacks = {
        "open": "Defect Type: Open Circuit<br>Impact: Electrical connectivity issues.<br>Solution: Check for broken traces or disconnects.",
        "short": "Defect Type: Short Circuit<br>Impact: Excessive current flow, potential overheating.<br>Solution: Inspect for unintended connections between traces.",
        "mousebite": "Defect Type: Mousebite<br>Impact: Possible leak paths.<br>Solution: Verify that all vias are properly filled and sealed.",
        "protrusion": "Defect Type: Protrusion<br>Impact: Signal degradation.<br>Solution: Remove or reduce the length of spurs using a PCB editor.",
        "copper": "Defect Type: Copper Puddles<br>Impact: Insulation issues.<br>Solution: Ensure proper etching and copper deposition processes.",
        "pin-hole": "Defect Type: Pin-hole<br>Impact: Weak solder joints.<br>Solution: Improve surface finish and soldering techniques."
    }
    return f"{count} {defect_type}(s) detected.<br>{feedbacks[defect_type]}"

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        test_file = request.files['test_image']
        temp_file = request.files['temp_image']

        test_image_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(test_file.filename))
        temp_image_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(temp_file.filename))

        test_file.save(test_image_path)
        temp_file.save(temp_image_path)

        start_time = time.time()
        defects, similarity_percentage, grade, highlighted_diff = process_images(test_image_path, temp_image_path)
        end_time = time.time()
        inference_time = end_time - start_time

        all_defects_img, defect_images, defect_counts = draw_defects(test_image_path, defects)
        feedbacks = generate_feedback(defect_counts)

        defect_image_paths = {}
        for defect_type, img in defect_images.items():
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            defect_filename = f"{defect_type}_result.png"
            defect_image_path = os.path.join(app.config['UPLOAD_FOLDER'], defect_filename)
            plt.imsave(defect_image_path, img_rgb)
            defect_image_paths[defect_type] = defect_filename

        all_defects_img_rgb = cv2.cvtColor(all_defects_img, cv2.COLOR_BGR2RGB)
        all_defects_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'all_defects_result.png')
        plt.imsave(all_defects_image_path, all_defects_img_rgb)

        highlighted_diff_rgb = cv2.cvtColor(highlighted_diff, cv2.COLOR_BGR2RGB)
        highlighted_diff_path = os.path.join(app.config['UPLOAD_FOLDER'], 'highlighted_diff.png')
        plt.imsave(highlighted_diff_path, highlighted_diff_rgb)

        pdf_report_path = os.path.join(app.config['UPLOAD_FOLDER'], 'report.pdf')
        generate_pdf_report(defects, similarity_percentage, grade, feedbacks, pdf_report_path)

        circuit_content = generate_circuit_file(defects, test_image_path)
        circuit_path = os.path.join(app.config['UPLOAD_FOLDER'], 'circuit.txt')
        with open(circuit_path, 'w') as f:
            f.write(circuit_content)

        return render_template('result.html', 
                             image_url=url_for('uploaded_file', filename='all_defects_result.png'), 
                             inference_time=f"{inference_time:.2f} seconds", 
                             feedbacks=feedbacks, 
                             defects=defects, 
                             CLASSES=CLASSES, 
                             defect_image_paths=defect_image_paths,
                             similarity_percentage=f"{similarity_percentage:.2f}%",
                             grade=grade,
                             highlighted_diff_url=url_for('uploaded_file', filename='highlighted_diff.png'),
                             pdf_report_url=url_for('uploaded_file', filename='report.pdf'),
                             circuit_file_url=url_for('uploaded_file', filename='circuit.txt'))

    return render_template('upload.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
import os
from werkzeug.utils import secure_filename as werkzeug_secure_filename

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def secure_filename(filename):
    return werkzeug_secure_filename(filename)

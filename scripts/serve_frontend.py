import http.server
import socketserver
import os
import sys

# Get the absolute path to the frontend directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
frontend_dir = os.path.join(project_root, 'frontend')

# Change to the frontend directory
os.chdir(frontend_dir)

# Set up the server
PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

print(f"Serving frontend files from {frontend_dir}")
print(f"Server running at http://localhost:{PORT}")

# Start the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever() 
import os
import sys
import socket
import time
import threading
import webbrowser

# Ensure backend modules can be imported in both script & PyInstaller frozen mode
if getattr(sys, 'frozen', False):
    BUNDLE_DIR = sys._MEIPASS
else:
    BUNDLE_DIR = os.path.dirname(os.path.abspath(__file__))

backend_path = os.path.join(BUNDLE_DIR, "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.main import app
import uvicorn

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_available_port(start_port: int = 8000, max_attempts: int = 20) -> int:
    for port in range(start_port, start_port + max_attempts):
        if not is_port_in_use(port):
            return port
    return start_port

def wait_and_open_browser(url: str, port: int):
    # Poll until server responds on port
    for _ in range(30):
        time.sleep(0.3)
        if is_port_in_use(port):
            break
    time.sleep(0.5)
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"[!] Please open your browser and navigate to: {url}")

def main():
    port = find_available_port(8000)
    url = f"http://127.0.0.1:{port}"

    print(r"""
=============================================================================
  ______ _____   ____   _____ _    _   _   _ ________   ___    _  _____
 |  ____|  __ \ / __ \ / ____| |  | | | \ | |  ____\ \ / / |  | |/ ____|
 | |__  | |__) | |  | | |    | |__| | |  \| | |__   \ V /| |  | | (___  
 |  __| |  ___/| |  | | |    |  __  | | . ` |  __|   > < | |  | |\___ \ 
 | |____| |    | |__| | |____| |  | | | |\  | |____ / . \| |__| |____) |
 |______|_|     \____/ \_____|_|  |_| |_| \_|______/_/ \_\\____/|_____/ 
                    ACADEMY — DESKTOP STANDALONE EDITION
=============================================================================
  [•] Tri-Pillar History + Political Science + STEM Coding Simulator
  [•] Local Engine : RUNNING
  [•] Access URL   : """ + url + r"""
  [•] Launching default web browser automatically...

  >>> Keep this window open while using the academy.
  >>> To exit, press Ctrl+C or simply close this window.
=============================================================================
""")

    # Open browser in a background thread once server starts listening
    threading.Thread(target=wait_and_open_browser, args=(url, port), daemon=True).start()

    # Run Uvicorn server (single process, safe for PyInstaller)
    try:
        uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")
    except (KeyboardInterrupt, SystemExit):
        print("\n[+] Epoch Nexus Academy closed. Goodbye!")

if __name__ == "__main__":
    main()

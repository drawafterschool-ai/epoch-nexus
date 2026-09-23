import os
import sys
import subprocess
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_DIR = os.path.join(ROOT_DIR, ".venv")
SCRIPTS_DIR = os.path.join(VENV_DIR, "Scripts" if sys.platform == "win32" else "bin")
PYTHON_EXE = os.path.join(SCRIPTS_DIR, "python.exe" if sys.platform == "win32" else "python")
PIP_EXE = os.path.join(SCRIPTS_DIR, "pip.exe" if sys.platform == "win32" else "pip")
PYINSTALLER_EXE = os.path.join(SCRIPTS_DIR, "pyinstaller.exe" if sys.platform == "win32" else "pyinstaller")

def run_cmd(cmd, cwd=ROOT_DIR):
    print(f"\n[BUILD] Running: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str))
    if res.returncode != 0:
        print(f"[ERROR] Command failed with code {res.returncode}")
        sys.exit(res.returncode)

def main():
    print("=" * 75)
    print("  EPOCH NEXUS ACADEMY — STANDALONE .EXE BUILD PIPELINE")
    print("=" * 75)

    # 1. Ensure virtual environment exists
    if not os.path.exists(PYTHON_EXE):
        print("\n[STEP 1/5] Creating dedicated Python virtual environment (.venv)...")
        run_cmd([sys.executable, "-m", "venv", VENV_DIR])
    else:
        print("\n[STEP 1/5] Virtual environment (.venv) already exists.")

    # 2. Install required dependencies into .venv
    print("\n[STEP 2/5] Installing backend dependencies & PyInstaller...")
    run_cmd([PYTHON_EXE, "-m", "pip", "install", "--upgrade", "pip"])
    run_cmd([PYTHON_EXE, "-m", "pip", "install", "-r", os.path.join(ROOT_DIR, "backend", "requirements.txt"), "pyinstaller"])

    # 3. Verify frontend/dist exists
    frontend_dist = os.path.join(ROOT_DIR, "frontend", "dist")
    if not os.path.exists(frontend_dist) or not os.path.exists(os.path.join(frontend_dist, "index.html")):
        print("\n[STEP 3/5] Compiling frontend production bundle (npm run build)...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        run_cmd(f"{npm_cmd} run build", cwd=os.path.join(ROOT_DIR, "frontend"))
    else:
        print(f"\n[STEP 3/5] Frontend build verified at: {frontend_dist}")

    # 4. Run PyInstaller
    print("\n[STEP 4/5] Packaging single-file executable with PyInstaller...")
    frontend_data = f"{os.path.join(ROOT_DIR, 'frontend', 'dist')};frontend/dist"
    backend_data = f"{os.path.join(ROOT_DIR, 'backend')};backend"

    pyinstaller_args = [
        PYINSTALLER_EXE,
        "--noconfirm",
        "--onefile",
        "--name", "EpochNexusAcademy",
        "--clean",
        "--add-data", frontend_data,
        "--add-data", backend_data,
        "--collect-all", "fastapi",
        "--collect-all", "starlette",
        "--collect-all", "uvicorn",
        "--collect-all", "websockets",
        "--collect-all", "pydantic",
        "--collect-all", "pydantic_core",
        "--hidden-import", "app",
        "--hidden-import", "app.main",
        "--hidden-import", "app.api.endpoints",
        "--hidden-import", "app.models.schemas",
        "--hidden-import", "app.core.security",
        "--hidden-import", "app.core.audit_logger",
        "--hidden-import", "app.services.ast_sanitizer",
        "--hidden-import", "app.services.evaluator",
        "--hidden-import", "app.services.tracks_data",
        "--hidden-import", "app.services.web3_bridge",
        "--hidden-import", "app.services.worker_queue",
        "--hidden-import", "app.services.scenario_generator",
        "desktop_launcher.py"
    ]

    run_cmd(pyinstaller_args)

    # 5. Copy output executable to root directory for easy access
    dist_exe = os.path.join(ROOT_DIR, "dist", "EpochNexusAcademy.exe")
    root_exe = os.path.join(ROOT_DIR, "EpochNexusAcademy.exe")
    if os.path.exists(dist_exe):
        shutil.copy2(dist_exe, root_exe)
        size_mb = os.path.getsize(root_exe) / (1024 * 1024)
        print("\n" + "=" * 75)
        print("  BUILD SUCCESSFUL!")
        print(f"  Standalone Executable : {root_exe}")
        print(f"  File Size             : {size_mb:.1f} MB")
        print("=" * 75)
        print("\nYou can now send 'EpochNexusAcademy.exe' to your friend!")
        print("When they double-click it, it will launch the academy and open their browser.")
    else:
        print("[ERROR] Built executable not found in dist/")
        sys.exit(1)

if __name__ == "__main__":
    main()

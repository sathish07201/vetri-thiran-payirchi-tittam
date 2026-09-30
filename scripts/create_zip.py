import os
import zipfile
import sys

def make_zip(output_filename="pocketsmart-ai.zip", source_dir="."):
    exclude_dirs = {"node_modules", ".git", "dist", "dist-server", "__pycache__", ".vite"}
    exclude_files = {output_filename, "package-lock.json", "bun.lock"}

    with zipfile.ZipFile(output_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # filter directories in place
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".")]
            for file in files:
                if file in exclude_files or file.endswith(".pyc") or file.endswith(".zip"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, source_dir)
                zipf.write(full_path, rel_path)
    print(f"Created {output_filename} successfully.")
    # Also ensure public/ copy exists for direct static download
    try:
        os.makedirs("public", exist_ok=True)
        import shutil
        if output_filename != "public/pocketsmart-ai.zip":
            shutil.copyfile(output_filename, "public/pocketsmart-ai.zip")
    except Exception as e:
        pass

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "pocketsmart-ai.zip"
    make_zip(out)

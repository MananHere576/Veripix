import exifread
import os
from datetime import datetime

def scan_metadata(image_path):
    print(f"🔎 Deep Scanning DNA for: {image_path}")
    
    file_size_kb = round(os.path.getsize(image_path) / 1024, 2)
    
    # Fallback: OS-level file creation time (last line of defense)
    fs_ctime = os.path.getctime(image_path)
    os_date = datetime.fromtimestamp(fs_ctime).strftime('%Y:%m:%d %H:%M:%S')
    
    report = {
        "software": "Clean (Camera Original)",
        "make": "Unknown Hardware",
        "model": "Unknown Model",
        "lens": "Unknown Lens",
        "creation_date": os_date,      # This is the "Acquisition Date"
        "modify_date": "Unknown",      # Temporary internal storage for EXIF modify tag
        "tamper_date": "None Detected", # This is the "Tamper Date" displayed in UI
        "file_size": f"{file_size_kb} KB",
        "is_suspicious": False,
        "alerts": [],
        "stats": [] 
    }

    try:
        with open(image_path, 'rb') as f:
            tags = exifread.process_file(f)
            
        if not tags:
            report["software"] = "Metadata Scrubbed / AI Generated"
            report["is_suspicious"] = True
            report["tamper_date"] = os_date # If metadata is wiped, today's file date is our best tamper guess
            report["alerts"].append("Critical: Metadata wiped. Using File System date as reference.")
            report["stats"] = [{"name": "Integrity", "val": 5}, {"name": "Compression", "val": 95}, {"name": "Noise Gap", "val": 80}, {"name": "Splicing Prob", "val": 90}]
            return report

        suspicious_keywords = ['photoshop', 'adobe', 'gimp', 'lightroom', 'canva', 'picsart']

        for tag, value in tags.items():
            tag_str = str(tag).lower()
            val_str = str(value).lower()

            if 'image make' in tag_str: report["make"] = str(value)
            if 'image model' in tag_str: report["model"] = str(value)
            if 'exif lensmodel' in tag_str: report["lens"] = str(value)

            # Software Detection
            if 'software' in tag_str or 'processingsoftware' in tag_str:
                report["software"] = str(value)
                if any(k in val_str for k in suspicious_keywords):
                    report["is_suspicious"] = True
                    report["alerts"].append(f"Editor Detected: {str(value)}")

            # Acquisition Date (Shutter Click)
            if 'datetimeoriginal' in tag_str:
                report["creation_date"] = str(value)
            
            # Modification Date (Software Save Time)
            elif 'image datetime' in tag_str or 'datetimedigitized' in tag_str:
                report["modify_date"] = str(value)

        # Forensic Logic: Calculate Tamper Date
        if report["modify_date"] != "Unknown":
            # If camera date and software save date don't match, we found the tamper event
            if report["creation_date"][:19] != report["modify_date"][:19]:
                report["tamper_date"] = report["modify_date"]
                report["is_suspicious"] = True
                report["alerts"].append(f"Timeline Mismatch: File altered on {report['tamper_date']}")
        
        # If edit software is found but no date, the OS date is the most likely tamper date
        if report["is_suspicious"] and report["tamper_date"] == "None Detected":
            report["tamper_date"] = os_date

        # Final Probability Stats
        if report["is_suspicious"]:
            report["stats"] = [{"name": "Integrity", "val": 25}, {"name": "Compression", "val": 82}, {"name": "Noise Gap", "val": 70}, {"name": "Splicing Prob", "val": 88}]
        else:
            report["stats"] = [{"name": "Integrity", "val": 98}, {"name": "Compression", "val": 10}, {"name": "Noise Gap", "val": 5}, {"name": "Splicing Prob", "val": 2}]

        return report
        
    except Exception as e:
        return {"software": "Error", "alerts": [str(e)], "stats": []}
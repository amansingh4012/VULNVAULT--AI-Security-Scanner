"""
Bandit scanner wrapper
Detects security issues in Python code
"""
import subprocess
import json
from typing import List, Dict
from pathlib import Path

class BanditScanner:
    def __init__(self):
        self.name = "Bandit"
        self.version = self._get_version()
    
    def _get_version(self) -> str:
        try:
            result = subprocess.run(
                ['bandit', '--version'],
                capture_output=True,
                text=True
            )
            return result.stdout.strip()
        except Exception:
            return "unknown"
    
    def scan_file(self, file_path: str) -> Dict:
        """
        Scan a single file with Bandit
        Returns parsed JSON results
        """
        try:
            result = subprocess.run(
                ['bandit', '-f', 'json', file_path],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                data = json.loads(result.stdout)
                return self._parse_results(data)
            
            return {"vulnerabilities": [], "errors": []}
            
        except Exception as e:
            return {"vulnerabilities": [], "errors": [str(e)]}
    
    def scan_directory(self, dir_path: str) -> Dict:
        """
        Scan entire directory recursively
        """
        try:
            result = subprocess.run(
                ['bandit', '-r', '-f', 'json', dir_path],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                data = json.loads(result.stdout)
                return self._parse_results(data)
            
            return {"vulnerabilities": [], "errors": []}
            
        except Exception as e:
            return {"vulnerabilities": [], "errors": [str(e)]}
    
    def _parse_results(self, data: Dict) -> Dict:
        """
        Parse Bandit JSON output into standardized format
        """
        vulnerabilities = []
        
        for result in data.get('results', []):
            vuln = {
                'scanner': 'bandit',
                'severity': result.get('issue_severity', 'UNKNOWN'),
                'confidence': result.get('issue_confidence', 'UNKNOWN'),
                'type': result.get('test_id', 'UNKNOWN'),
                'description': result.get('issue_text', ''),
                'line_number': result.get('line_number', 0),
                'line_range': result.get('line_range', []),
                'code': result.get('code', ''),
                'filename': result.get('filename', ''),
                'more_info': result.get('more_info', '')
            }
            vulnerabilities.append(vuln)
        
        return {
            'vulnerabilities': vulnerabilities,
            'metrics': data.get('metrics', {}),
            'errors': data.get('errors', [])
        }

# Example usage
if __name__ == "__main__":
    scanner = BanditScanner()
    print(f"Bandit version: {scanner.version}")
    
    # Test with a sample vulnerable file
    test_code = """
import pickle
import os

# Hardcoded password
PASSWORD = "admin123"

def load_data(filename):
    # Unsafe pickle
    with open(filename, 'rb') as f:
        return pickle.load(f)

def execute_command(cmd):
    # Command injection vulnerability
    os.system(cmd)
"""
    
    with open('test_vulnerable.py', 'w') as f:
        f.write(test_code)
    
    results = scanner.scan_file('test_vulnerable.py')
    print(json.dumps(results, indent=2))
    
    # Cleanup
    os.remove('test_vulnerable.py')

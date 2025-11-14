"""
Intentionally vulnerable Python code for testing VulnVault
This file contains common security vulnerabilities
"""
import os
import pickle
import subprocess

# Vulnerability 1: Hardcoded password
PASSWORD = "admin123"
API_KEY = "sk-1234567890abcdef"

# Vulnerability 2: SQL Injection
def get_user(user_id):
    import sqlite3
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    # BAD: String formatting in SQL query
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    return cursor.fetchone()

# Vulnerability 3: Command Injection
def run_command(user_input):
    # BAD: Direct execution of user input
    os.system(user_input)
    
# Vulnerability 4: Unsafe Deserialization
def load_data(filename):
    with open(filename, 'rb') as f:
        # BAD: Pickle can execute arbitrary code
        return pickle.load(f)

# Vulnerability 5: Path Traversal
def read_file(filename):
    # BAD: No validation of filename
    with open(f"/var/data/{filename}", 'r') as f:
        return f.read()

# Vulnerability 6: Shell Injection
def ping_host(host):
    # BAD: Using shell=True with user input
    subprocess.call(f"ping -c 1 {host}", shell=True)

# Vulnerability 7: Weak cryptography
def encrypt_password(password):
    import hashlib
    # BAD: MD5 is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()

# Vulnerability 8: Using exec()
def run_user_code(code):
    # BAD: exec() can run arbitrary code
    exec(code)

# Vulnerability 9: Assert used for security
def is_admin(user):
    # BAD: Asserts can be disabled
    assert user.is_admin == True
    return True

# Vulnerability 10: Insecure random
import random
def generate_token():
    # BAD: random is not cryptographically secure
    return random.randint(1000, 9999)

if __name__ == "__main__":
    print("This file contains 10+ security vulnerabilities!")
    print("VulnVault should detect most of them.")

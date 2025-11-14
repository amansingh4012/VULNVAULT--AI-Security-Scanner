// Vulnerable JavaScript Code for Testing VulnVault
// This file contains multiple security vulnerabilities

// 1. Hardcoded credentials
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "admin123";
const SECRET_TOKEN = "super-secret-token";

// 2. SQL Injection vulnerability
function getUserById(userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    db.query(query);  // Dangerous!
}

// 3. XSS vulnerability
function displayUserInput(userInput) {
    document.getElementById("output").innerHTML = userInput;  // XSS risk
    document.write(userInput);  // Also dangerous
}

// 4. Command Injection
const exec = require('child_process').exec;

function pingHost(hostname) {
    exec('ping -c 4 ' + hostname);  // Command injection!
}

// 5. Unsafe eval
function calculateExpression(expression) {
    return eval(expression);  // Never use eval!
}

// 6. Insecure randomness
function generateToken() {
    return Math.random().toString(36);  // Not cryptographically secure
}

// 7. Insecure cookie
document.cookie = "session=" + sessionId;  // Should use secure, httpOnly flags

// 8. Weak cryptography
const crypto = require('crypto');
function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');  // MD5 is broken!
}

// 9. Path traversal
const fs = require('fs');
function readFile(filename) {
    return fs.readFileSync('/uploads/' + filename);  // Path traversal risk
}

// 10. Prototype pollution
function merge(target, source) {
    for (let key in source) {
        target[key] = source[key];  // Vulnerable to prototype pollution
    }
}

// 11. RegEx DoS
function validateEmail(email) {
    const regex = /^([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@([a-zA-Z0-9])+((\.)([a-zA-Z0-9])+)+$/;
    return regex.test(email);  // Can cause DoS with crafted input
}

console.log("This file contains 11+ vulnerabilities for testing!");

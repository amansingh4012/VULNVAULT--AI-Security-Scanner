// Vulnerable C++ Code for Testing VulnVault
#include <iostream>
#include <cstring>
#include <cstdlib>

using namespace std;

// 1. Buffer overflow vulnerability
void copyData(char* input) {
    char buffer[10];
    strcpy(buffer, input);  // UNSAFE! No bounds checking
    cout << buffer << endl;
}

// 2. Use of unsafe gets()
void readInput() {
    char buffer[100];
    gets(buffer);  // Deprecated and unsafe
    cout << buffer << endl;
}

// 3. Format string vulnerability
void printLog(char* userInput) {
    printf(userInput);  // Should use printf("%s", userInput)
}

// 4. SQL Injection (if using MySQL C++ connector)
void getUserData(string userId) {
    string query = "SELECT * FROM users WHERE id = " + userId;
    // Execute query - vulnerable to SQL injection
}

// 5. Integer overflow
void allocateMemory(int size) {
    if (size > 0) {
        char* buffer = new char[size];  // Could overflow
        // Use buffer...
        delete[] buffer;
    }
}

// 6. Use after free
void useAfterFreeVuln() {
    char* ptr = new char[100];
    delete[] ptr;
    strcpy(ptr, "data");  // Use after free!
}

// 7. Null pointer dereference
void nullPointerVuln() {
    char* ptr = nullptr;
    cout << *ptr << endl;  // Crash!
}

// 8. Insecure random
int generateRandomToken() {
    srand(time(0));
    return rand();  // Not cryptographically secure
}

// 9. Command injection via system()
void executeCommand(string userCmd) {
    system(userCmd.c_str());  // Command injection!
}

// 10. Hardcoded credentials
const char* API_KEY = "1234567890abcdef";
const char* PASSWORD = "admin123";

int main() {
    char input[200];
    cout << "This C++ file contains 10+ vulnerabilities!" << endl;
    
    // Trigger some vulnerabilities
    copyData(input);
    
    return 0;
}

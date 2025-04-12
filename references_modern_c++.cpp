// Listing 1. Parameter passing by reference.
#include <iostream>

void modifyByReference(int &x)
{
    x = x * 2;
}

int main()
{
    int num = 10;
    std::cout << "Original value: " << num << std::endl; // Output: 10
    modifyByReference(num);
    std::cout << "Modified value: " << num << std::endl; // Output: 20
    return 0;
}

// Listing 2. lvalue and rvalue.
int value = 7;        // value is an lvalue, 7 is an rvalue
int *pValue = &value; // Valid: can take the address of an lvalue
// int* pSeven = &7;      // Invalid: cannot take the address of an rvalue (literal)

// Listing 3. Pre and post increment with lvalue.
int num = 5;
int *ptr1 = &++num; // Valid: ++num returns an lvalue
// int* ptr2 = &num++;  // Invalid: num++ returns an rvalue
// int* ptr3 = &(7 + value);  // Invalid: 7 + value is an rvalue

// Listing 4. Const lvalue references binding to rvalues.
#include <iostream>

class Test
{
public:
    Test() { std::cout << "Constructor" << std::endl; }
    Test(const Test &other) { std::cout << "Copy Constructor" << std::endl; }
    ~Test() { std::cout << "Destructor" << std::endl; }
};

Test getTest()
{
    std::cout << "getTest() called" << std::endl;
    return Test(); // Returns a temporary Test object (rvalue)
}

int main()
{
    const int &ref = 7;              // Legal
    const Test &testRef = getTest(); // Constant lvalue reference binds to rvalue
    std::cout << "After binding" << std::endl;
    return 0;
}

// Listing 5. Rvalue references.
#include <iostream>

int getValue()
{
    return 42; // Returns an rvalue (temporary)
}

int main()
{
    int &&rref = getValue(); // rref binds to the temporary returned by getValue()
    rref = 100;              // Modifying the temporary object

    std::cout << rref << std::endl; // Output: 100
    return 0;
}

// Listing 6. The MyString class with constructor, destructor, move constructor, and move assignment operator.
#include <iostream>
#include <cstring>

class MyString
{
private:
    char *data;
    size_t length;

public:
    // Constructor
    MyString(const char *str) : length(std::strlen(str))
    {
        data = new char[length + 1];
        std::strcpy(data, str);
        std::cout << "Constructor called for: " << str << std::endl;
    }

    // Destructor
    ~MyString()
    {
        delete[] data;
        std::cout << "Destructor called" << std::endl;
    }

    // Move Constructor
    MyString(MyString &&other) noexcept : data(other.data), length(other.length)
    {
        other.data = nullptr;
        other.length = 0;
        std::cout << "Move constructor called" << std::endl;
    }

    // Move Assignment Operator
    MyString &operator=(MyString &&other) noexcept
    {
        std::cout << "Move assignment operator called" << std::endl;
        if (this != &other)
        {
            delete[] data;
            data = other.data;
            length = other.length;
            other.data = nullptr;
            other.length = 0;
        }
        return *this;
    }
};

// Listing 7. Using the MyString class, demonstrating the move constructor.
//  Factory function that returns a temporary object
MyString createString(const char *str)
{
    return MyString(str); // Move constructor will be used if elision is disabled
}

int main()
{
    MyString str1 = createString("Hello"); // Move constructor called
    MyString str2 = std::move(str1);       // Move constructor called

    return 0;
}

// Listing 8. Perfect Forwarding.
#include <iostream>
#include <utility> // std::forward

void processValue(int &i)
{
    std::cout << "Lvalue reference overload: " << i << std::endl;
}

void processValue(int &&i)
{
    std::cout << "Rvalue reference overload: " << i << std::endl;
}

template <typename T>
void forwardValue(T &&arg)
{
    processValue(std::forward<T>(arg));
}

int main()
{
    int x = 10;
    forwardValue(x);  // Calls processValue(int&)
    forwardValue(20); // Calls processValue(int&&)
    return 0;
}

// Listing 9. Named rvalue references.
#include <iostream>
#include <utility>

void process(int &&val)
{
    std::cout << "Rvalue version of process: " << val << std::endl;
}

void process(int &val)
{
    std::cout << "Lvalue version of process: " << val << std::endl;
}

void doSomething(int &&rval)
{
    process(rval);            // Calls the lvalue overload of process!
    process(std::move(rval)); // Calls the rvalue overload of process
}

int main()
{
    int num = 42;
    doSomething(std::move(num));
    return 0;
}

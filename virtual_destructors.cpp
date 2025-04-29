#include <iostream>
#include <string>

// Listing 1: Base Class with Non-Virtual Destructor.
class AnimalNoVirtual
{
public:
    AnimalNoVirtual() { std::cout << "Animal Constructor\n"; }
    ~AnimalNoVirtual() { std::cout << "Animal Destructor\n"; } // Non-virtual destructor
};

// Listing 2: DogNoVirtual Derived Class.
class DogNoVirtual : public AnimalNoVirtual
{
private:
    std::string *breed;

public:
    DogNoVirtual(const std::string &breedName) : breed(new std::string(breedName))
    {
        std::cout << "Dog Constructor\n";
    }
    ~DogNoVirtual()
    {
        std::cout << "Dog Destructor\n";
        delete breed; // Release allocated memory
    }
};

// Listing 3: Demonstrating Non-Virtual Destructor Problem
int main()
{
    AnimalNoVirtual *animalPtr = new DogNoVirtual("Golden Retriever");
    delete animalPtr; // Only AnimalNoVirtual's destructor is called. Memory leak!
    return 0;
}

// Listing 4: Polymorphic Base Class with Virtual Destructor
#include <iostream>
#include <string>

class Animal
{
public:
    Animal() { std::cout << "Animal Constructor\n"; }
    virtual ~Animal() { std::cout << "Animal Destructor\n"; } // Virtual destructor
};

// Listing 5: Base Class with Protected Destructor Pattern
class AnimalProtected
{
protected:
    ~AnimalProtected() { std::cout << "AnimalProtected Destructor\n"; }
};

class DogProtected : public AnimalProtected
{
public:
    ~DogProtected() { std::cout << "DogProtected Destructor\n"; }
};

// Listing 6: Demonstrating Protected Destructor Usage
int main()
{
    // AnimalProtected* b = new DogProtected();
    // delete b; // Error! Protected destructor

    DogProtected *d = new DogProtected();
    delete d; // OK
    return 0;
}
const starterCode : any =  {
    "cpp": `#include <iostream>

int main()
{
    std::cout<<"Hello World";

    return 0;
}`,
    "python": `print("Hello World")`,

    "javascript": `console.log("Hello World");`,

    "java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    "kotlin": `fun main() {
    println("Hello, World!")
}`,
    "go": `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,
}

export default starterCode;
const student = {
    name: "Jeffy",
    age: 17,
    isActive: true,
    grades: [4, 3, 3.5]
}

student.name = "someone" //Can edit property inside student

console.log(typeof student.name+" - Name: "+student.name);
console.log(typeof student.age+" - Age: "+student.age)
console.log(typeof student.isActive+" -  Active Status: "+student.isActive)
console.log(typeof student.grades+" - Student Grades")
console.log("Math: "+student.grades[0])
console.log("English: "+student.grades[1])
console.log("History: "+student.grades[2])

console.log(Array.isArray(student.grades))
console.log(Array.isArray(student))
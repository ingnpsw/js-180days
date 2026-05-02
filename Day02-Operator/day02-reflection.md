- const prevents reassigning the variable itself
- but you can still modify properties inside it
- typeof [] returns object because arrays are a type of object in JS
- Array.isArray() checks if something is a list [] or not
- student.grades is [4, 3, 3.5] -> a list -> returns true
- student is {name: "Jeffy", ...} -> not a list -> returns false

## Object vs Array

Object {} → stores named data
- use when data has labels
- access by name: student.name
- example: { name: "Jeffy", age: 17 }

Array [] → stores ordered list
- use when data is a sequence
- access by number: grades[0]
- example: [4, 3, 3.5]

Array of Objects → list of named data
- example: [{name: "Math", score: 9}, {name: "English", score: 8}]
- access: subjects[0].name → "Math"

Object with Array → named data that contains a list
- example: { name: "Jeffy", grades: [4, 3, 3.5] }
- access: student.grades[0] → 4

+ string  -> concatenate
- * /     -> convert to number
null      -> 0
undefined -> NaN
whitespace string -> 0
"4px"     -> NaN (มีตัวอักษรปน)
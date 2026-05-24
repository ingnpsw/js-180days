// pattern 1
// *
// **
// ***
// ****
// *****

// const size = 5;
// let stars = "";

// for(let i = 0 ; i <= size; i++){
//     stars += "*";
//     console.log(stars);
// }

// pattern 2
//      *
//     **
//    ***
//   ****
//  *****

// const size = 5;

// for(let i = 1; i <= size; i++){ //Row selected
//     let spaces = "";
//     let stars = "";
//     for(let j = 1; j <= size - i; j++){  //สร้าง space ของ row นั้น
//         spaces += " ";
//     }
//     for(let k = 1; k <= i; k++){ //สร้าง star ของ row นั้น
//         stars += "*";
//     }
//     console.log(spaces + stars); //print row นั้น
// }

// Pattern 3: Pyramid
//     *
//    ***
//   *****
//  *******
// *********

// const size = 5;

// for(let i = 1; i <= size; i++){
//     let spaces = "";
//     let stars = "";

//     for(let j = 1; j <= size - i; j++){
//         spaces += " ";
//     }

//     for(let k = 1; k <= i * 2 - 1; k++){
//         stars += "*";
//     }
//     console.log(spaces + stars);
// }

//Challenge: Inverted Right Triangle
// *****
//  ****
//   ***
//    **
//     *

const size = 5;

for(let i = 1; i <= size; i++){
    let spaces = "";
    let stars = "";

    for(let j = 1; j <= i - 1; j++){
        spaces += " ";
    }

    for(let k = 1; k <= size - i + 1; k++){
        stars += "*";
    }
    console.log(spaces + stars);
}

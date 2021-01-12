var moveZeros = function (arr) {
  arr.forEach((c,i) => {
    if(c===0) {
     let result = arr.splice(i,1);
     arr.push(result);
    }

  })
  console.log(arr)
 }

moveZeros([1,2,0,1,0,1,0,3,0,1]);
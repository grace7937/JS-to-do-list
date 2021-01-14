function pigIt(str){
  const a = str.split(' ');
  const b =a.map(c=>{
  return c.split('').shift()+'ay';
  });
  
  const d = a.map(c=> {
    return c.split('').splice(1);
  })
 
  const m = d.map(c=>{
   return c.join('');
  });
 
 const result = m.map((c,i)=> {
    return c+ b[i];
  });
 console.log(result.join());

  
}
pigIt('Pig latin is cool');

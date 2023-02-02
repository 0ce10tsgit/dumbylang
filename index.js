const fs = require('fs');
const r = require('readline-sync');
const lang = require('./source.js')
function sort(raws){
  //getting rid of extra spaces from the split via spaces in case of double ups
  raw = raws.split(' ')
  for(let b in raw){
    raw[b] = raw[b].trim()
  }
  return (raw.filter(r => r !== ''))
}
function read(name){
  let seal = fs.readFileSync('./' + name, {encoding:'utf8', flag:'r'});
  let done = sort(seal)
  return done
}
let s = 1001
while(s != 0){
  s--
  let a = (r.question('\x1b[36;44;1m>\x1b[32;40;4m')).split(' ')
  if(a[0] == 'read'){
    //get file contents(auto sorted)
    let a = read('code.txt')
    //create new exeuctionm
    let thingy = new lang.exec()
    //run file contents
    thingy.run(a)
  }
}
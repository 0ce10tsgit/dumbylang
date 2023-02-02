class execution {
  constructor(data = {}, registry = {}, id = '0',layer = '0') {
    this.id = '0'
    this.data = data
    this.registry = registry
    this.layer = layer

  }
  newData(data) {
    this.data[this.id] = data
    this.registry[data.name] = this.id
    this.id = (parseInt(this.id) + 1).toString()
    if (parseInt(this.id) > 1000) {
      //TODO
    }
  }
  newScope(code) {
    let sub = new execution(this.data, this.registry, this.id,(parseInt(this.layer)+1).toString())
    let result = sub.run(code)
    return result.data
  }
  run(long) {
    let ln = long
    let truln = []
    for (let a in ln) {
      //didnt use .map cus im dumb
      if (ln[a].includes('\n')) {
        let crap = ln[a].split('\n')
        crap.forEach(b => truln.push(b))
        continue
      }
      truln.push(ln[a])
    }
    let num = 0
    while (num < truln.length) {
      let tru = []
      let n = 0
      let check = this.evalute(truln[num])
      switch (check) {
        case 'var': case 'array':
          tru = []
          while (truln[num].charAt(truln[num].length - 1) != ';') {
            tru.push(truln[num])
            num++
          }
          tru.push(truln[num].split(';')[0])
          this.line(tru)
          break
        case 'funky':
          tru = []
          while (truln[num] != '};') {
            tru.push(truln[num])
            num++
          }
          this.line(tru)
          break
        case 'return':
          num++
          return this.evalute(truln[num])
      }
      num += 1
    }
    console.log(this.data)
  }
  line(ln) {
    let dat;
    switch (this.evalute(ln[0])) {
      case 'var':
        dat = ''
        this.newData(
          { name: this.evalute(ln[1]), type: 'var', data: this.evalute(ln.slice(3)) }
        )
        break
      case 'array':
        this.newData(
          { name: this.evalute(ln[1]), type: 'array', data: this.evalute(ln.slice(3)) }
        )
        break
      case 'proc':
        dat = []
        if (ln[1].includes('(')) {
          dat = ln[1].substring(ln[1].indexOf("(") + 1, ln[1].lastIndexOf(")")).split(',');
        }
        this.newData(
          { name: this.evalute(ln[1].split("{")[0]).split('(')[0], type: 'function', data: { args: dat, code: this.evalute(ln.slice(2)) } })
        break
    }
  }
  evalute(toeval) {
    let temp = (typeof toeval == 'string') ? [toeval] : toeval
    for (let crap in temp) {
      if (temp[crap][0] == '$') {
        let fuck = this.registry[(temp[crap]).split('$')[1]]
        return this.data[fuck]
      }
      if (temp[crap][0] == '#') {
        let fuck = this.registry[(temp[crap]).split('#')[1].split('[')[0]]
        return [this.data[fuck].data[(temp[crap]).split('#')[1].split('[')[1].split(']')[0]]]
      }
      if (temp[crap][0] == '@') {
        return this.newScope(sort("var a = 1;\nreturn $a"))
      }
    }
    return toeval
  }
}
module.exports = {
  exec: execution
}
function sort(raws){
  //getting rid of extra spaces from the split via spaces in case of double ups
  raw = raws.split(' ')
  for(let b in raw){
    raw[b] = raw[b].trim()
  }
  return (raw.filter(r => r !== ''))
}
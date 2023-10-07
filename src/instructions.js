import { registers } from './store.js'
export class Instructions {
  constructor(duplicate, exchange, assignment) {
    this.duplicate = duplicate;
    this.exchange = exchange;
    this.assignment = assignment;
  }
  update_registers() {
    registers.subscribe(r => {
      this.registers = r
    })()
  }
  get_size(reg) {
    this.update_registers()
    const register = this.registers.find(r => r.name === reg.toUpperCase());
    if (register) {
      return register.size;
    }
  }
  movaps(reg1, reg2) {
    let size = this.get_size(reg1)
    for (let i = 0; i < size; i++) {
      this.duplicate(reg1.toUpperCase(), i, reg2.toUpperCase(), i)
    }
  }
  vshufps(reg1, reg2, reg3, imm) {
    //
  }
}

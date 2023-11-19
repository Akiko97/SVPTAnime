import { registers } from './store.js'
export class Instructions {
  constructor(duplicate, exchange, assignment) {
    this.duplicate = duplicate
    this.exchange = exchange
    this.assignment = assignment
    this.moveRecord = []
  }
  move(regName, index, fromRegName, fromIndex, callback = null) {
    if (regName === fromRegName) {
      const i = this.moveRecord.indexOf(`exchange_${fromRegName}_${fromIndex}_${regName}_${index}`)
      if (i !== -1) {
        this.moveRecord.splice(i, 1)
      }
      else {
        this.exchange(regName, index, fromRegName, fromIndex, callback)
        this.moveRecord.push(`exchange_${regName}_${index}_${fromRegName}_${fromIndex}`)
      }
    }
    else {
      this.duplicate(regName, index, fromRegName, fromIndex, callback)
    }
  }
  clear_record() {
    this.moveRecord = []
  }
  update_registers() {
    registers.subscribe(r => {
      this.registers = r
    })()
  }
  get_size(reg) {
    this.update_registers()
    const register = this.registers.find(r => r.name === reg.toUpperCase())
    if (register) {
      return register.size
    }
  }
  get_values(reg) {
    this.update_registers()
    const register = this.registers.find(r => r.name === reg.toUpperCase())
    if (register) {
      return register.values
    }
  }
  get_type(reg) {
    if (reg.toUpperCase()[0] === 'X') {
      return 'XMM'
    }
    else if (reg.toUpperCase()[0] === 'Y') {
      return 'YMM'
    }
    else if (reg.toUpperCase()[0] === 'Z') {
      return 'ZMM'
    }
    else {
      return 'GPR'
    }
  }
  movaps(reg1, reg2) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    let size = this.get_size(reg1)
    for (let i = 0; i < size; i++) {
      this.move(reg1, i, reg2, i)
    }
  }
  vshufps(reg1, reg2, reg3, imm8) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    switch (this.get_type(reg1)) {
      case 'XMM':
        this.move(reg1, 0, reg2, (imm8 & 0x11))
        this.move(reg1, 1, reg2, ((imm8 >> 2) & 0x11))
        this.move(reg1, 2, reg3, ((imm8 >> 4) & 0x11))
        this.move(reg1, 3, reg3, ((imm8 >> 6) & 0x11))
        break
      case 'YMM':
        this.move(reg1, 0, reg2, (imm8 & 0b11))
        this.move(reg1, 1, reg2, ((imm8 >> 2) & 0b11))
        this.move(reg1, 2, reg3, ((imm8 >> 4) & 0b11))
        this.move(reg1, 3, reg3, ((imm8 >> 6) & 0b11))
        this.move(reg1, 4, reg2, 4 + (imm8 & 0b11))
        this.move(reg1, 5, reg2, 4 + ((imm8 >> 2) & 0b11))
        this.move(reg1, 6, reg3, 4 + ((imm8 >> 4) & 0b11))
        this.move(reg1, 7, reg3, 4 + ((imm8 >> 6) & 0b11))
        break
      case 'ZMM':
        //
        break
    }
  }
  vxorps(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    for (let i = 0; i < this.get_size(reg1); i++) {
      this.assignment(reg1, i, this.get_values(reg2)[i] ^ this.get_values(reg3)[i], [
        { name: reg2, index: i },
        { name: reg3, index: i },
      ])
    }
  }
  vperm2f128(reg1, reg2, reg3, imm8) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    const select4 = (dst, fi, src1, src2, control) => {
      if ((control & 0b1000) === 0b1000) {
        for (let i = 0; i < 4; i++) {
          this.assignment(dst, fi + i, 0)
        }
      }
      else {
        const loop = this.get_size(dst) / 2
        switch (control & 0b11) {
          case 0:
            for (let i = 0; i < loop; i++) {
              this.move(dst, fi + i, src1, i)
            }
            break
          case 1:
            for (let i = 0; i < loop; i++) {
              this.move(dst, fi + i, src1, loop + i)
            }
            break
          case 2:
            for (let i = 0; i < loop; i++) {
              this.move(dst, fi + i, src2, i)
            }
            break
          case 3:
            for (let i = 0; i < loop; i++) {
              this.move(dst, fi + i, src2, loop + i)
            }
            break
        }
      }
    }
    select4(reg1, 0, reg2, reg3, imm8 & 0b1111)
    select4(reg1, this.get_size(reg1) / 2, reg2, reg3, (imm8 >> 4) & 0b1111)
  }
  vpermq(reg1, reg2, imm8) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    const select4 = (dst, fi, src, control) => {
      const loop = this.get_size(dst) / 4
      for (let i = 0; i < loop; i++) {
        this.move(dst, fi + i, src, (control & 0b11) * loop + i)
      }
    }
    switch (this.get_type(reg1)) {
      case 'YMM':
        const d = this.get_size(reg1) / 4
        select4(reg1, 0, reg2, (imm8 >> 0) & 0b11)
        select4(reg1, d, reg2, (imm8 >> 2) & 0b11)
        select4(reg1, 2 * d, reg2, (imm8 >> 4) & 0b11)
        select4(reg1, 3 * d, reg2, (imm8 >> 6) & 0b11)
        break
      case 'ZMM':
        //
        break
    }
  }
  vmulpd(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    for (let i = 0; i < this.get_size(reg1); i++) {
      this.assignment(reg1, i, this.get_values(reg2)[i] * this.get_values(reg3)[i], [
        { name: reg2, index: i },
        { name: reg3, index: i },
      ])
    }
  }
  vfmadd213pd(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    for (let i = 0; i < this.get_size(reg1); i++) {
      this.assignment(reg1, i, this.get_values(reg1)[i] * this.get_values(reg2)[i] + this.get_values(reg3)[i], [
        { name: reg1, index: i },
        { name: reg2, index: i },
        { name: reg3, index: i },
      ])
    }
  }
  vfmadd132pd(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    for (let i = 0; i < this.get_size(reg1); i++) {
      this.assignment(reg1, i, this.get_values(reg1)[i] * this.get_values(reg3)[i] + this.get_values(reg2)[i], [
        { name: reg1, index: i },
        { name: reg2, index: i },
        { name: reg3, index: i },
      ])
    }
  }
  vfmadd231pd(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    for (let i = 0; i < this.get_size(reg1); i++) {
      this.assignment(reg1, i, this.get_values(reg2)[i] * this.get_values(reg3)[i] + this.get_values(reg1)[i], [
        { name: reg1, index: i },
        { name: reg2, index: i },
        { name: reg3, index: i },
      ])
    }
  }
  vmovapd(reg1, reg2) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    let size = this.get_size(reg1)
    for (let i = 0; i < size; i++) {
      this.move(reg1, i, reg2, i)
    }
  }
  vextractf128(reg1, reg2, imm8) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    switch (this.get_type(reg2)) {
      case 'YMM':
        switch (this.get_size(reg2)) {
          case 4:
            switch (imm8 & 0b1) {
              case 0:
                this.move(reg1, 0, reg2, 0)
                this.move(reg1, 1, reg2, 1)
                break
              case 1:
                this.move(reg1, 0, reg2, 2)
                this.move(reg1, 1, reg2, 3)
                break
            }
            break
          case 8:
            switch (imm8 & 0b1) {
              case 0:
                this.move(reg1, 0, reg2, 0)
                this.move(reg1, 1, reg2, 1)
                this.move(reg1, 2, reg2, 2)
                this.move(reg1, 3, reg2, 3)
                break
              case 1:
                this.move(reg1, 0, reg2, 4)
                this.move(reg1, 1, reg2, 5)
                this.move(reg1, 2, reg2, 6)
                this.move(reg1, 3, reg2, 7)
                break
            }
            break
        }
        break
      case "ZMM":
        //
        break
    }
  }
  shufpd(reg1, reg2, imm8) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    if ((imm8 & 0b1) === 0) {
      this.move(reg1, 0, reg1, 0)
    }
    else {
      this.move(reg1, 0, reg1, 1)
    }
    if ((imm8 & 0b10) === 0) {
      this.move(reg1, 1, reg2, 0)
    }
    else {
      this.move(reg1, 1, reg2, 1)
    }
  }
  vbroadcastsd(reg1, reg2) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    switch (this.get_type(reg1)) {
      case 'YMM':
        this.move(reg1, 0, reg2, 0, () => {
          this.move(reg1, 1, reg2, 0, () => {
            this.move(reg1, 2, reg2, 0, () => {
              this.move(reg1, 3, reg2, 0)
            })
          })
        })
        break
      case 'ZMM':
        //
        break
    }
  }
  vaddps(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    for (let i = 0; i < this.get_size(reg1); i++) {
      this.assignment(reg1, i, this.get_values(reg2)[i] + this.get_values(reg3)[i], [
        { name: reg2, index: i },
        { name: reg3, index: i },
      ])
    }
  }
  vhaddps(reg1, reg2, reg3) {
    this.clear_record()
    reg1 = reg1.toUpperCase()
    reg2 = reg2.toUpperCase()
    reg3 = reg3.toUpperCase()
    this.assignment(reg1, 0, this.get_values(reg2)[0] + this.get_values(reg2)[1], [
      { name: reg2, index: 0 },
      { name: reg2, index: 1 },
    ])
    this.assignment(reg1, 1, this.get_values(reg2)[2] + this.get_values(reg2)[3], [
      { name: reg2, index: 2 },
      { name: reg2, index: 3 },
    ])
    this.assignment(reg1, 2, this.get_values(reg3)[0] + this.get_values(reg3)[1], [
      { name: reg3, index: 0 },
      { name: reg3, index: 1 },
    ])
    this.assignment(reg1, 3, this.get_values(reg3)[2] + this.get_values(reg3)[3], [
      { name: reg3, index: 2 },
      { name: reg3, index: 3 },
    ])
    this.assignment(reg1, 4, this.get_values(reg2)[4] + this.get_values(reg2)[5], [
      { name: reg2, index: 4 },
      { name: reg2, index: 5 },
    ])
    this.assignment(reg1, 5, this.get_values(reg2)[6] + this.get_values(reg2)[7], [
      { name: reg2, index: 6 },
      { name: reg2, index: 7 },
    ])
    this.assignment(reg1, 6, this.get_values(reg3)[4] + this.get_values(reg3)[5], [
      { name: reg3, index: 4 },
      { name: reg3, index: 5 },
    ])
    this.assignment(reg1, 7, this.get_values(reg3)[6] + this.get_values(reg3)[7], [
      { name: reg3, index: 6 },
      { name: reg3, index: 7 },
    ])
  }
}

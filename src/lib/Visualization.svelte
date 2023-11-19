<script>
  import { registers, register_config } from '../store.js'
  import { basic } from '../basic.js'
  import { speed_all } from '../speed.js'
  import Node from './Node.svelte'
  $: {
    $registers.forEach(register => {
      const config = register_config.find(config => config.name === register.name)
      register.stroke = config.stroke
      register.fill = config.fill
    });
  }
  export const exchange = (regName1, index1, regName2, index2, callback = null) => {
    basic.exchange($registers, () => {
      registers.update(regs => {
        const reg1 = regs.find(register => register.name === regName1)
        const reg2 = regs.find(register => register.name === regName2)
        const tmp = reg1.values[index1]
        reg1.values[index1] = reg2.values[index2]
        reg2.values[index2] = tmp
        return regs
      })
    }, regName1, index1, regName2, index2)
    if (callback) {
      setTimeout(callback, speed_all)
    }
  }
  export const assignment = (regName, index, newValue, fromRegs = [], callback = null) => {
    const _assignment = () => {
      basic.assignment($registers, () => {
        registers.update(regs => {
          const reg = regs.find(register => register.name === regName)
          reg.values[index] = newValue
          return regs
        })
      }, regName, index, newValue)
    }
    const allRegsAreSame = fromRegs.every(reg => {
      return reg.name === regName
    })
    if (allRegsAreSame) {
      _assignment()
    }
    else {
      fromRegs.forEach(fromReg => {
        basic.duplicate($registers, () => {
          _assignment()
        }, regName, index, fromReg.name, fromReg.index)
      })
    }
    if (callback) {
      setTimeout(callback, speed_all)
    }
  }
  export const duplicate = (regName, index, fromRegName, fromIndex, callback = null) => {
    basic.duplicate($registers, () => {
      registers.update(regs => {
        const reg = regs.find(register => register.name === regName)
        const fromReg = regs.find(register => register.name === fromRegName)
        reg.values[index] = fromReg.values[fromIndex]
        return regs
      })
    }, regName, index, fromRegName, fromIndex)
    if (callback) {
      setTimeout(callback, speed_all)
    }
  }
</script>

<div>
  <div>
    {#each $registers as register}
      <div class="register_container">
        <p style="margin-right: 10px; width: 60px; height: 30px; margin-top: 0; margin-bottom: 0;">{register.name}:</p>
        <div id={`${register.name}`} class="register_container">
          {#each Array.from({length: register.size}, (_, i) => i) as index}
            <Node id={`${register.name}_${register.size}_${register.size - 1 - index}`} text={`${register.values[register.size - index - 1]}`} stroke={`${register.stroke}`} fill={`${register.fill}`} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .register_container {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
  }
</style>

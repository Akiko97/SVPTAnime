<script>
  import { registers, register_config } from '../store.js'
  import { basic } from '../basic.js'
  import Button from './Button.svelte'
  import Node from './Node.svelte'
  $: {
    $registers.forEach(register => {
      const config = register_config.find(config => config.name === register.name)
      register.stroke = config.stroke
      register.fill = config.fill
    });
  }
  const exchange = (regName1, index1, regName2, index2) => {
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
  }
  const assignment = (regName, index, newValue) => {
    basic.assignment($registers, () => {
      registers.update(regs => {
        const reg = regs.find(register => register.name === regName)
        reg.values[index] = newValue
        return regs
      })
    }, regName, index, newValue)
  }
  const duplicate = (regName, index, fromRegName, fromIndex) => {
    basic.duplicate($registers, () => {
      registers.update(regs => {
        const reg = regs.find(register => register.name === regName)
        const fromReg = regs.find(register => register.name === fromRegName)
        reg.values[index] = fromReg.values[fromIndex]
        return regs
      })
    }, regName, index, fromRegName, fromIndex)
  }
  const test = () => {
    exchange('YMM0', 4, 'YMM1', 0)
    exchange('YMM0', 5, 'YMM1', 1)
    exchange('YMM0', 6, 'YMM1', 2)
    exchange('YMM0', 7, 'YMM1', 3)
  }
  const test2 = () => {
    exchange('YMM0', 4, 'YMM0', 0)
    exchange('YMM0', 5, 'YMM0', 1)
    exchange('YMM0', 6, 'YMM0', 2)
    exchange('YMM0', 7, 'YMM0', 3)
  }
  const test3 = () => {
    assignment('YMM0', 0, 99)
    assignment('YMM0', 1, 99)
    assignment('YMM0', 2, 99)
    assignment('YMM0', 3, 99)
  }
  const test4 = () => {
    duplicate('YMM0', 0, 'YMM1', 0)
    duplicate('YMM0', 1, 'YMM1', 1)
    duplicate('YMM0', 2, 'YMM1', 2)
    duplicate('YMM0', 3, 'YMM1', 3)
  }
</script>

<div>
    <div>
        <Button click={test} text="Test1" />
        <Button click={test2} text="Test2" />
        <Button click={test3} text="Test3" />
        <Button click={test4} text="Test4" />
        <div>
            {#each $registers as register}
                <div class="register_container">
                    <p>{register.name}:</p>
                    <div id={`${register.name}`} class="register_container">
                        {#each Array.from({length: register.size}, (_, i) => i) as index}
                            <Node id={`${register.name}_${register.size}_${index}`} text={`${register.values[index]}`} stroke={`${register.stroke}`} fill={`${register.fill}`} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .register_container {
        display: flex;
        flex-wrap: wrap;
    }
</style>

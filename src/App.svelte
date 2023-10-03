<script>
  import anime from 'animejs'
  import { utilities } from './utilities.js'
  import { registers, register_config } from './store.js'
  import Button from './lib/Button.svelte'
  import Node from './lib/Node.svelte'
  $: {
    $registers.forEach(register => {
      const config = register_config.find(config => config.name === register.name)
      register.stroke = config.stroke
      register.fill = config.fill
    });
  }
  const exchange = (regName1, index1, regName2, index2) => {
    const id1 = `${regName1}_${$registers.find(register => register.name === regName1).size}_${index1}`
    const id2 = `${regName2}_${$registers.find(register => register.name === regName2).size}_${index2}`
    const diff = utilities.calcCoordinatesDiffById(id1, id2)
    anime({
      targets: `#${id1}`,
      translateX: diff.diffX,
      translateY: diff.diffY,
      rotate: '0turn',
      duration: 800,
    })
    anime({
      targets: `#${id2}`,
      translateX: -diff.diffX,
      translateY: -diff.diffY,
      rotate: '0turn',
      duration: 800,
      complete: () => {
        registers.update(regs => {
          const reg1 = regs.find(register => register.name === regName1)
          const reg2 = regs.find(register => register.name === regName2)
          const tmp = reg1.values[index1]
          reg1.values[index1] = reg2.values[index2]
          reg2.values[index2] = tmp
          return regs
        })
        anime({
          targets: `#${id1}`,
          translateX: 0,
          translateY: 0,
          duration: 0,
        })
        anime({
          targets: `#${id2}`,
          translateX: 0,
          translateY: 0,
          duration: 0,
        })
      },
    })
  }
  const assignment = (regName, index, newValue) => {
    anime({
      targets: `#${regName}_${$registers.find(register => register.name === regName).size}_${index}`,
      translateY: [
        { value: -50, duration: 200, easing: 'easeOutQuad' },
        { value: 0, duration: 200, easing: 'easeInQuad' },
      ],
      rotate: [
        { value: 15, duration: 100, easing: 'easeOutQuad' },
        { value: -15, duration: 100, easing: 'easeInQuad' },
        { value: 0, duration: 100, easing: 'easeOutQuad' },
      ],
      duration: 0,
      complete: () => {
        registers.update(regs => {
          const reg = regs.find(register => register.name === regName)
          reg.values[index] = newValue
          return regs
        })
      },
    })
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
</script>

<main>
  <div class="card">
    <Button click={test} text="Test" />
    <Button click={test2} text="Test2" />
    <Button click={test3} text="Test3" />
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
</main>

<style>
.register_container {
  display: flex;
  flex-wrap: wrap;
}
</style>

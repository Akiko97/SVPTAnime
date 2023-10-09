<script>
  import { onMount } from 'svelte'
  import { registers } from '../store.js'
  import Visualization from './Visualization.svelte'
  import Editor from './Editor.svelte'
  import Button from './Button.svelte'
  import { Instructions } from '../instructions.js'
  let visualizationRef
  let editorRef
  let i
  onMount(() => {
    i = new Instructions(
      visualizationRef.duplicate,
      visualizationRef.exchange,
      visualizationRef.assignment
    )
  })
  const code = 'movaps ymm2, ymm0\n' +
               'movaps ymm3, ymm1\n' +
               'vshufps ymm4, ymm2, ymm3, 0x4E\n' +
               'vperm2f128 ymm5, ymm2, ymm3, 0x20\n' +
               'vpermq ymm5, ymm5, 0x4E\n' +
               'vxorps ymm0, ymm0, ymm0'
  registers.update(() => [
    { name: 'YMM0', size: 8, values: [8, 1, 3, 5, 7, 9, 2, 4] },
    { name: 'YMM1', size: 8, values: [1, 3, 5, 7, 9, 2, 4, 6] },
    { name: 'YMM2', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM3', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM4', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM5', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
  ])
  const executeInstruction = (instructionStr) => {
    const tokens = instructionStr.split(/[\s,]+/)
    const instructionName = tokens[0]
    const args = tokens.slice(1)
    if (typeof i[instructionName] === 'function') {
      i[instructionName].apply(i, args)
    } else {
      console.error(`Unknown instruction: ${instructionName}`)
    }
  }
  let step = 1
  const test = () => {
    editorRef.removeHighlight()
    if (step > code.split('\n').length) {
      step = 1
      registers.update(() => [
        { name: 'YMM0', size: 8, values: [8, 1, 3, 5, 7, 9, 2, 4] },
        { name: 'YMM1', size: 8, values: [1, 3, 5, 7, 9, 2, 4, 6] },
        { name: 'YMM2', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'YMM3', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'YMM4', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'YMM5', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
      ])
    }
    else {
      editorRef.highlightLine(step)
      const instructionStr = code.split('\n')[step - 1]
      executeInstruction(instructionStr)
      step++
    }
  }
</script>

<div class="main-container">
  <div id="editor-container">
    <Editor bind:this={editorRef} {code} />
  </div>
  <div id="visualization-container">
    <Visualization bind:this={visualizationRef} />
  </div>
  <Button click={test} text="Test" />
</div>

<style>
  .main-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  #editor-container {
    width: 50%;
    height: 100%;
  }
  #visualization-container {
    width: 50%;
    height: 100%;
  }
</style>

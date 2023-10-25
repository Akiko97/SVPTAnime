<script>
  import {onMount} from 'svelte'
  import {code, history, registers} from '../store.js'
  import Visualization from './Visualization.svelte'
  import Editor from './Editor.svelte'
  import Blockly from './Blockly.svelte'
  import Button from './Button.svelte'
  import {Instructions} from '../instructions.js'

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
  code.update(() => {
    // return 'vperm2f128 ymm0, ymm0, ymm0, 0x01\n' +
    //   'movaps ymm2, ymm0\n' +
    //   'movaps ymm3, ymm1\n' +
    //   'vshufps ymm4, ymm2, ymm3, 0x4E\n' +
    //   'vperm2f128 ymm5, ymm2, ymm3, 0x20\n' +
    //   'vpermq ymm5, ymm5, 0x4E\n' +
    //   'vxorps ymm0, ymm0, ymm0\n' +
    //   'vxorps ymm0, ymm1, ymm2'
    return 'vextractf128 xmm0, ymm0, 1\n' +
      'vbroadcastsd ymm5, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm4, xmm0\n' +
      'vextractf128 xmm0, ymm0, 0\n' +
      'vbroadcastsd ymm7, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm6, xmm0\n' +
      'vmulpd ymm7, ymm3, ymm7\n' +
      'vfmadd213pd ymm6, ymm2, ymm7\n' +
      'vfmadd213pd ymm5, ymm1, ymm6\n' +
      'vfmadd213pd ymm4, ymm0, ymm5\n' +
      'vmovapd ymm8, ymm4\n' +
      '\n' +
      'vextractf128 xmm0, ymm1, 1\n' +
      'vbroadcastsd ymm5, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm4, xmm0\n' +
      'vextractf128 xmm0, ymm1, 0\n' +
      'vbroadcastsd ymm7, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm6, xmm0\n' +
      'vmulpd ymm7, ymm3, ymm7\n' +
      'vfmadd213pd ymm6, ymm2, ymm7\n' +
      'vfmadd213pd ymm5, ymm1, ymm6\n' +
      'vfmadd213pd ymm4, ymm0, ymm5\n' +
      'vmovapd ymm9, ymm4\n' +
      '\n' +
      'vextractf128 xmm0, ymm2, 1\n' +
      'vbroadcastsd ymm5, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm4, xmm0\n' +
      'vextractf128 xmm0, ymm2, 0\n' +
      'vbroadcastsd ymm7, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm6, xmm0\n' +
      'vmulpd ymm7, ymm3, ymm7\n' +
      'vfmadd213pd ymm6, ymm2, ymm7\n' +
      'vfmadd213pd ymm5, ymm1, ymm6\n' +
      'vfmadd213pd ymm4, ymm0, ymm5\n' +
      'vmovapd ymm10, ymm4\n' +
      '\n' +
      'vextractf128 xmm0, ymm3, 1\n' +
      'vbroadcastsd ymm5, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm4, xmm0\n' +
      'vextractf128 xmm0, ymm3, 0\n' +
      'vbroadcastsd ymm7, xmm0\n' +
      'shufpd xmm0, xmm0, 1\n' +
      'vbroadcastsd ymm6, xmm0\n' +
      'vmulpd ymm7, ymm3, ymm7\n' +
      'vfmadd213pd ymm6, ymm2, ymm7\n' +
      'vfmadd213pd ymm5, ymm1, ymm6\n' +
      'vfmadd213pd ymm4, ymm0, ymm5\n' +
      'vmovapd ymm11, ymm4'
  })
  registers.update(() => [
    // { name: 'YMM0', size: 8, values: [8, 1, 3, 5, 7, 9, 2, 4] },
    // { name: 'YMM1', size: 8, values: [1, 3, 5, 7, 9, 2, 4, 6] },
    // { name: 'YMM2', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    // { name: 'YMM3', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    // { name: 'YMM4', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    // { name: 'YMM5', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM0', size: 4, values: [3, 2, 1, 0] },
    { name: 'YMM1', size: 4, values: [7, 6, 5, 4] },
    { name: 'YMM2', size: 4, values: [11, 10, 9, 8] },
    { name: 'YMM3', size: 4, values: [15, 14, 13, 12] },
    { name: 'XMM0', size: 2, values: [0, 0] },
    { name: 'YMM4', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM5', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM6', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM7', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM8', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM9', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM10', size: 4, values: [0, 0, 0, 0] },
    { name: 'YMM11', size: 4, values: [0, 0, 0, 0] },
  ])
  const executeInstruction = (instructionStr) => {
    const tokens = instructionStr.split(/[\s,]+/)
    const instructionName = tokens[0]
    const args = tokens.slice(1)
    if (typeof i[instructionName] === 'function') {
      i[instructionName].apply(i, args)
    }
    else if (instructionName[0] === ';' || instructionName === '') {
      console.log('Not runnable code')
    }
    else {
      console.error(`Unknown instruction: ${instructionName}`)
    }
  }
  let step = 1
  const run = () => {
    editorRef.removeHighlight()
    if (step > $code.split('\n').length) {
      step = 1
      editorRef.highlightLine(step)
      registers.update(() => [
        // { name: 'YMM0', size: 8, values: [8, 1, 3, 5, 7, 9, 2, 4] },
        // { name: 'YMM1', size: 8, values: [1, 3, 5, 7, 9, 2, 4, 6] },
        // { name: 'YMM2', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        // { name: 'YMM3', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        // { name: 'YMM4', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        // { name: 'YMM5', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
        { name: 'YMM0', size: 4, values: [3, 2, 1, 0] },
        { name: 'YMM1', size: 4, values: [7, 6, 5, 4] },
        { name: 'YMM2', size: 4, values: [11, 10, 9, 8] },
        { name: 'YMM3', size: 4, values: [15, 14, 13, 12] },
        { name: 'XMM0', size: 2, values: [0, 0] },
        { name: 'YMM4', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM5', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM6', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM7', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM8', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM9', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM10', size: 4, values: [0, 0, 0, 0] },
        { name: 'YMM11', size: 4, values: [0, 0, 0, 0] },
      ])
      clear_history()
    }
    else {
      const instructionStr = $code.split('\n')[step - 1]
      save($registers)
      executeInstruction(instructionStr)
      step++
      editorRef.highlightLine(step)
    }
  }
  const undo = () => {
    editorRef.removeHighlight()
    if (step > 1) {
      step--
    }
    else {
      return
    }
    editorRef.highlightLine(step)
    registers.update(() => {
      return pop()
    })
  }
  const save = (regs) => {
    history.update(() => {
      const h = $history
      h.push(JSON.parse(JSON.stringify($registers)))
      return h
    })
  }
  const clear_history = () => {
    history.update(() => {
      return []
    })
  }
  const pop = () => {
    let ret
    history.update(() => {
      const h = $history
      ret = h.pop()
      return h
    })
    return ret
  }
</script>

<div class="main-container">
  <div id="gcode-container">
    <div id="blockly-container">
      <Blockly />
    </div>
    <div id="editor-container">
      <Editor bind:this={editorRef} />
    </div>
  </div>
  <div id="visualization-container">
    <Visualization bind:this={visualizationRef} />
  </div>
  <Button click={run} text="Run" />
  <Button click={undo} text="Undo" />
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
  #gcode-container {
    width: 50%;
    height: 100%;
  }
  #blockly-container {
    width: 100%;
    height: 50%;
  }
  #editor-container {
    width: 100%;
    height: 50%;
  }
  #visualization-container {
    width: 50%;
    height: 100%;
  }
</style>

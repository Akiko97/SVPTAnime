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
    i = new Instructions(visualizationRef.duplicate, visualizationRef.exchange, visualizationRef.assignment)
  })
  const code = 'movaps ymm2, ymm0\n' +
               'movaps ymm3, ymm1\n' +
               'vshufps ymm4, ymm2, ymm3, 0x4E\n' +
               'vperm2f128 ymm5, ymm2, ymm3, 0x20\n' +
               'vpermq ymm5, ymm5, 0x4E\n' +
               'vxorps ymm0, ymm0, ymm0\n'
  let step = 1
  registers.update(() => [
    { name: 'YMM0', size: 8, values: [8, 1, 3, 5, 7, 9, 2, 4] },
    { name: 'YMM1', size: 8, values: [1, 3, 5, 7, 9, 2, 4, 6] },
    { name: 'YMM2', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM3', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM4', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'YMM5', size: 8, values: [0, 0, 0, 0, 0, 0, 0, 0] },
  ])
  const test = () => {
    editorRef.removeHighlight()
    editorRef.highlightLine(step)
    switch (step) {
      case 1:
        i.movaps('ymm2', 'ymm0')
        break
      case 2:
        i.movaps('ymm3', 'ymm1')
        break
      case 3:
        visualizationRef.duplicate('YMM4', 0, 'YMM2', 5)
        visualizationRef.duplicate('YMM4', 1, 'YMM2', 4)
        visualizationRef.duplicate('YMM4', 2, 'YMM3', 7)
        visualizationRef.duplicate('YMM4', 3, 'YMM3', 6)
        visualizationRef.duplicate('YMM4', 4, 'YMM2', 1)
        visualizationRef.duplicate('YMM4', 5, 'YMM2', 0)
        visualizationRef.duplicate('YMM4', 6, 'YMM3', 3)
        visualizationRef.duplicate('YMM4', 7, 'YMM3', 2)
        break
      case 4:
        visualizationRef.duplicate('YMM5', 0, 'YMM2', 4)
        visualizationRef.duplicate('YMM5', 1, 'YMM2', 5)
        visualizationRef.duplicate('YMM5', 2, 'YMM2', 6)
        visualizationRef.duplicate('YMM5', 3, 'YMM2', 7)
        visualizationRef.duplicate('YMM5', 4, 'YMM3', 4)
        visualizationRef.duplicate('YMM5', 5, 'YMM3', 5)
        visualizationRef.duplicate('YMM5', 6, 'YMM3', 6)
        visualizationRef.duplicate('YMM5', 7, 'YMM3', 7)
        break
      case 5:
        visualizationRef.exchange('YMM5', 0, 'YMM5', 4)
        visualizationRef.exchange('YMM5', 1, 'YMM5', 5)
        visualizationRef.exchange('YMM5', 2, 'YMM5', 6)
        visualizationRef.exchange('YMM5', 3, 'YMM5', 7)
        break
      case 6:
        visualizationRef.assignment('YMM0', 0, 0)
        visualizationRef.assignment('YMM0', 1, 0)
        visualizationRef.assignment('YMM0', 2, 0)
        visualizationRef.assignment('YMM0', 3, 0)
        visualizationRef.assignment('YMM0', 4, 0)
        visualizationRef.assignment('YMM0', 5, 0)
        visualizationRef.assignment('YMM0', 6, 0)
        visualizationRef.assignment('YMM0', 7, 0)
        break
    }
    step++
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

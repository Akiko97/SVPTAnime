<script>
  import { registers } from '../store.js'
  import Visualization from './Visualization.svelte'
  import Editor from './Editor.svelte'
  import Button from './Button.svelte'
  let visualizationRef
  let editorRef
  const code = `movaps ymm2, ymm0
movaps ymm3, ymm1
vshufps ymm4, ymm2, ymm3, 0x4E
vperm2f128 ymm5, ymm2, ymm3, 0x20
vpermq ymm5, ymm5, 0x4E
vxorps ymm0, ymm0, ymm0
  `
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
        visualizationRef.duplicate('YMM2', 0, 'YMM0', 0)
        visualizationRef.duplicate('YMM2', 1, 'YMM0', 1)
        visualizationRef.duplicate('YMM2', 2, 'YMM0', 2)
        visualizationRef.duplicate('YMM2', 3, 'YMM0', 3)
        visualizationRef.duplicate('YMM2', 4, 'YMM0', 4)
        visualizationRef.duplicate('YMM2', 5, 'YMM0', 5)
        visualizationRef.duplicate('YMM2', 6, 'YMM0', 6)
        visualizationRef.duplicate('YMM2', 7, 'YMM0', 7)
        break
      case 2:
        visualizationRef.duplicate('YMM3', 0, 'YMM1', 0)
        visualizationRef.duplicate('YMM3', 1, 'YMM1', 1)
        visualizationRef.duplicate('YMM3', 2, 'YMM1', 2)
        visualizationRef.duplicate('YMM3', 3, 'YMM1', 3)
        visualizationRef.duplicate('YMM3', 4, 'YMM1', 4)
        visualizationRef.duplicate('YMM3', 5, 'YMM1', 5)
        visualizationRef.duplicate('YMM3', 6, 'YMM1', 6)
        visualizationRef.duplicate('YMM3', 7, 'YMM1', 7)
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

<div>
  <div id="editor-container">
    <Editor bind:this={editorRef} {code} />
  </div>
  <div id="visualization-container">
    <Visualization bind:this={visualizationRef} />
  </div>
    <Button click={test} text="Test" />
</div>

<style>
</style>

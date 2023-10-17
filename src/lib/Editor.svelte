<script>
  import { onMount } from 'svelte'
  import * as monaco from 'monaco-editor'
  let editor
  export let code
  onMount(() => {
    monaco.languages.register({ id: 'assembly' })
    monaco.languages.setMonarchTokensProvider('assembly', {
      tokenizer: {
        root: [
          [/\b(?:mov|add|sub|jmp|...)\b/, 'keyword'],
          [/;.*$/, 'comment'],
          // ...其他的令牌和规则
        ],
      },
    })
    editor = monaco.editor.create(document.getElementById('monaco-container'), {
      value: code,
      language: 'assembly',
      theme: 'vs-dark',
      automaticLayout: true
    })
  })
  let decorations = []
  export const highlightLine = (lineNumber) => {
    decorations.push(editor.createDecorationsCollection([
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: { isWholeLine: true, linesDecorationsClassName: 'highlight-line' },
      },
    ]))
  }
  export const highlightInline = (lineNumber, from, to) => {
    decorations.push(editor.createDecorationsCollection([
      {
        range: new monaco.Range(lineNumber, from, lineNumber, to),
        options: { inlineClassName: 'highlight-inline' },
      },
    ]))
  }
  export const removeHighlight = () => {
    decorations.forEach((decoration) => {
      decoration.clear()
    })
    decorations = []
  }
</script>

<div style="height: 100%;">
  <div id="monaco-container"></div>
</div>

<style>
  #monaco-container {
    height: 100%;
  }
</style>

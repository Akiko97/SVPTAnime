<script>
  import { onMount } from 'svelte'
  import * as monaco from 'monaco-editor'
  import Button from './Button.svelte'
  let editor
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
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: '; assembly code here\nmov rax, rbx\n',
      language: 'assembly',
      theme: 'vs-dark',
    })
  })
  let decorations = []
  const highlightLine = (lineNumber) => {
    decorations.push(editor.createDecorationsCollection([
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: { isWholeLine: true, linesDecorationsClassName: 'highlight-line' },
      },
    ]))
  }
  const highlightInline = (lineNumber, from, to) => {
    decorations.push(editor.createDecorationsCollection([
      {
        range: new monaco.Range(lineNumber, from, lineNumber, to),
        options: { inlineClassName: 'highlight-inline' },
      },
    ]))
  }
  const removeHighlight = () => {
    decorations.forEach((decoration) => {
      decoration.clear()
    })
    decorations = []
  }
  const test = () => {
    highlightLine(1)
    highlightInline(1, 1, 11)
  }
  const test2 = () => {
    highlightLine(2)
    highlightInline(2, 1, 4)
  }
  const test3 = () => {
    removeHighlight()
  }
</script>

<div>
  <Button click={test} text="Test" />
  <Button click={test2} text="Test2" />
  <Button click={test3} text="Test3" />
  <div id="editor-container"></div>
</div>

<style>
  #editor-container {
    height:500px;
  }
</style>

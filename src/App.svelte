<script>
  import Visualization from './lib/Visualization.svelte'
  import Editor from './lib/Editor.svelte'
</script>

<main id="app-container">
  <div class="card">
    <div id="editor-container">
      <Editor />
    </div>
    <div id="visualization-container">
      <Visualization />
    </div>
  </div>
</main>

<style>
</style>

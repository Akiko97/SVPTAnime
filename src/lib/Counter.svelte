<script>
  import anime from 'animejs'
  let moved = false
  const increment = () => {
    if (moved) {
      anime({
        targets: 'button',
        translateX: 0,
        rotate: '0turn',
        duration: 800
      })
    }
    else {
      anime({
        targets: '#move-button',
        translateX: 250,
        rotate: '1turn',
        duration: 800
      })
    }
    moved = !moved
  }
</script>

<button on:click={increment} id="move-button">
  Move!
</button>

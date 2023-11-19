<script>
  import anime from 'animejs'
  export let id
  export let stroke
  export let fill
  export let text
  let translateX = 100
  const clicked = () => {
    anime({
      targets: `#${id}`,
      translateX: translateX,
      rotate: '1turn',
      duration: 800
    })
    translateX += 100
  }
</script>

<div {id} role="button" tabindex="0" on:click={clicked} on:keyup={() => {}} style="z-index: 0;">
    <svg width="60" height="30">
<!--        <circle cx="30" cy="30" r="25" {stroke} stroke-width="4" {fill} />-->
        <rect x="0" y="0" width="60" height="30" {stroke} stroke-width="4" {fill} />
        <text x="30" y="15" text-anchor="middle" dominant-baseline="middle" fill="black" font-size="20">{text}</text>
    </svg>
</div>

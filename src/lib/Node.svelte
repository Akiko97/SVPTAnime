<script>
    import anime from 'animejs'
    export let id
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

<div {id} role="button" tabindex="0" on:click={clicked} on:keyup={() => {}}>
    <svg width="100" height="100">
        <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>
</div>

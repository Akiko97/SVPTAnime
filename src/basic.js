import anime from 'animejs'
import { utilities } from './utilities.js'

const exchange = (registers, update, regName1, index1, regName2, index2) => {
  const id1 = `${regName1}_${registers.find(register => register.name === regName1).size}_${index1}`
  const id2 = `${regName2}_${registers.find(register => register.name === regName2).size}_${index2}`
  const diff = utilities.calcCoordinatesDiffById(id1, id2)
  anime({
    targets: `#${id1}`,
    zIndex: [
      { value: 9999, duration: 0 }
    ],
  })
  anime({
    targets: `#${id2}`,
    zIndex: [
      { value: 9999, duration: 0 }
    ],
  })
  anime({
    targets: `#${id1}`,
    translateX: diff.diffX,
    translateY: diff.diffY,
    rotate: '0turn',
    duration: 800,
  })
  anime({
    targets: `#${id2}`,
    translateX: -diff.diffX,
    translateY: -diff.diffY,
    rotate: '0turn',
    duration: 800,
    complete: () => {
      update()
      anime({
        targets: `#${id1}`,
        translateX: 0,
        translateY: 0,
        duration: 0,
      })
      anime({
        targets: `#${id2}`,
        translateX: 0,
        translateY: 0,
        duration: 0,
      })
      anime({
        targets: `#${id1}`,
        zIndex: [
          { value: 0, duration: 0 }
        ],
      })
      anime({
        targets: `#${id2}`,
        zIndex: [
          { value: 0, duration: 0 }
        ],
      })
    },
  })
}
const assignment = (registers, update, regName, index, newValue) => {
  anime({
    targets: `#${regName}_${registers.find(register => register.name === regName).size}_${index}`,
    zIndex: [
      { value: 9999, duration: 0 }
    ],
  })
  anime({
    targets: `#${regName}_${registers.find(register => register.name === regName).size}_${index}`,
    translateY: [
      { value: -50, duration: 200, easing: 'easeOutQuad' },
      { value: 0, duration: 200, easing: 'easeInQuad' },
    ],
    rotate: [
      { value: 15, duration: 100, easing: 'easeOutQuad' },
      { value: -15, duration: 100, easing: 'easeInQuad' },
      { value: 0, duration: 100, easing: 'easeOutQuad' },
    ],
    duration: 0,
    complete: () => {
      update()
      anime({
        targets: `#${regName}_${registers.find(register => register.name === regName).size}_${index}`,
        zIndex: [
          { value: 0, duration: 0 }
        ],
      })
    },
  })
}
const duplicate = (registers, update, regName, index, fromRegName, fromIndex) => {
  const id = `${regName}_${registers.find(register => register.name === regName).size}_${index}`
  const fromId = `${fromRegName}_${registers.find(register => register.name === fromRegName).size}_${fromIndex}`
  const diff = utilities.calcCoordinatesDiffById(id, fromId)
  anime({
    targets: `#${fromId}`,
    zIndex: [
      { value: 9999, duration: 0 }
    ],
  })
  anime({
    targets: `#${fromId}`,
    translateX: -diff.diffX,
    translateY: -diff.diffY,
    rotate: '0turn',
    duration: 800,
    complete: () => {
      update()
      anime({
        targets: `#${fromId}`,
        translateX: 0,
        translateY: 0,
        rotate: '0turn',
        duration: 300,
      })
      anime({
        targets: `#${fromId}`,
        zIndex: [
          { value: 0, duration: 0 }
        ],
      })
    },
  })
}

export const basic = {
  exchange, duplicate, assignment
}

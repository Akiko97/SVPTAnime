export const utilities = {
  getCoordinateById: (id) => {
    let element = document.getElementById(id)
    // let rect = element.getBoundingClientRect()
    // let docScrollLeft = document.documentElement.scrollLeft
    // let docScrollTop = document.documentElement.scrollTop
    // let absoluteTop = rect.top + docScrollTop
    // let absoluteLeft = rect.left + docScrollLeft
    let absoluteTop = element.offsetTop
    let absoluteLeft = element.offsetLeft
    return { absoluteTop, absoluteLeft }
  },
  calcCoordinatesDiffById: (id1, id2) => {
    let coord1 = utilities.getCoordinateById(id1)
    let coord2 = utilities.getCoordinateById(id2)
    let diffX = coord2.absoluteLeft - coord1.absoluteLeft
    let diffY = coord2.absoluteTop - coord1.absoluteTop
    return { diffX, diffY }
  }
}

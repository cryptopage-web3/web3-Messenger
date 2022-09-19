const triggerAnimation = elem => {
  elem.classList.remove('focus') // reset animation
  elem.offsetHeight // trigger reflow
  elem.classList.add('focus') // start animation
}

//TODO smooth scroll doesnt work
export const scrollToMessage = itemId => {
  const item = document.getElementById(itemId)
  const viewPort = document.getElementById('messages-view-port')
  const scrollContainer = document.getElementById('messages-scroll-container')

  if (!item || !viewPort || !scrollContainer) return

  triggerAnimation(item)

  const itemPosition = item.getBoundingClientRect()

  const viewPortPosition = viewPort.getBoundingClientRect()

  const newScrollTop =
    scrollContainer.scrollTop + itemPosition.y - viewPortPosition.y

  const centerShift =
    scrollContainer.clientHeight < itemPosition.height
      ? 0
      : scrollContainer.clientHeight / 2 - itemPosition.height / 2

  scrollContainer.scroll({
    top: newScrollTop - centerShift,
    left: 0,
    behavior: 'smooth'
  })
}

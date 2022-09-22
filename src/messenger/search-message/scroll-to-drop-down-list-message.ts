//TODO smooth scroll doesnt work
export const scrollToDropDownListMessage = itemIndex => {
  const scrollContainer = document.getElementById(
    'drop-down-suggestions-container'
  )

  const item = scrollContainer.children[itemIndex]

  if (!item || !scrollContainer) return

  const itemPosition = item.getBoundingClientRect()
  const scrollContainerPosition = scrollContainer.getBoundingClientRect()

  const newScrollTop =
    scrollContainer.scrollTop + itemPosition.y - scrollContainerPosition.y

  scrollContainer.scroll({
    top: newScrollTop,
    left: 0,
    behavior: 'smooth'
  })
}

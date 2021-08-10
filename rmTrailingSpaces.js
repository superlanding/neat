export default function rmTrailingSpaces(context) {
  const lines = context.content.split("\n")
  const last = lines.length - 1
  context.rows = lines.map((line, i) => {
    let nextLine = line.replace(/[\t\s]+$/, '')
    if (i < last) {
      nextLine = nextLine + '\n'
    }
    return { line: nextLine }
  })
  return context
}

export default function getObjValueStr(props) {

  const commaProps = props.map((p, i) => {
    // no comma dangle
    if (i === (props.length - 1)) {
      return p
    }
    return p + ','
  })
  const arr = ['{', ...commaProps, '  }']

  return arr.map((p, i) => {
    // no newline for closing curly brace
    if (i === (arr.length - 1)) {
      return p
    }
    return p + `\n`
  })
  .join('')
}

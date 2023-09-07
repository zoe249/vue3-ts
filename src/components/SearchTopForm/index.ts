type TselectOptions = {
  name: string
  code: string | number
  [key: string]: unknown
}
type TsearchItem = {
  placeholder?: string
  selectOptions?: Array<TselectOptions>
  label?: string
  type?: string
  [key: string]: any
}
type TviewList = {
  newName: string
  planname: string
  isDefault: boolean
  isEdit?: boolean
  defa: TsearchItem
}

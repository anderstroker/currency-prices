
export const SelectCurrency = ({options, onChange, value}) => {
  return (
    <select 
      onChange={onChange}
      className="form-select container-sm"
      value={value}
      
    >
      <option value="select">Selecciona la divisa</option>
      {options && options.length > 0 && options.map((op, index) => (
        <option key={index} value={op.value}>{op.label}</option>
      ))}
    </select>
  )
}
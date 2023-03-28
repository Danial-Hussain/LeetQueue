import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface InputProps {
  name: string
  label: string
  value: string
  placeholder?: string
  disabled?: boolean
  type?: string
  onChange?: any
  autoFocus?: boolean
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  value,
  placeholder,
  disabled,
  type,
  onChange,
  autoFocus
}) => {
  const inputRef = useRef(null)
  const [focus, setFocus] = useState(false)
  const labelIsAnimated =
    focus || (value?.length > 0 && typeof value !== "undefined")

  useEffect(() => {
    if (autoFocus) {
      queueMicrotask(() => inputRef.current.focus())
    }
  }, [autoFocus, inputRef])

  return (
    <Container>
      <input
        tabIndex={-1}
        type={type || "text"}
        name={name}
        style={{ opacity: 0, height: 0, width: 0, position: "absolute" }}
        aria-hidden="true"
      />
      <StyledInput
        ref={inputRef}
        id={name}
        type={type || "text"}
        autoComplete="off"
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <LabelAnimation labelIsAnimated={labelIsAnimated}>
        <Label htmlFor={name}>{label}</Label>
      </LabelAnimation>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const Label = styled.label`
  top: -2px;
  border: none;
  display: block;
  font-size: 14px;
  position: relative;
  white-space: nowrap;
  pointer-events: none;
  transition: color 0.3s ease;
  color: ${(p) => p.theme.colors.gray};
`

const LabelAnimation = styled.span<{ labelIsAnimated: boolean }>`
  top: 0;
  bottom: 0;
  display: block;
  position: absolute;
  pointer-events: none;
  font-weight: 400;
  padding: 10px 14px 12px;
  will-change: transform, font-weight;
  transform: perspective(100px);
  transform-origin: 0 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    font-weight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  ${(p) =>
    p.labelIsAnimated &&
    `
    label { color: ${p.theme.colors.light_grey}; opacity: 1; }
    font-weight: 600;
    transform: translate(6px, -1px) scale(0.6) perspective(100px) translateZ(0.001px);
  `};
`

const StyledInput = styled.input`
  appearance: none;
  height: 36px;
  width: 150px;
  font-size: 16px;
  padding: 12px 14px 6px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  border-radius: 7px;
  border: none;
  background: ${(p) => p.theme.colors.off_white};
  transition: box-shadow 0.25s ease, background 0.25s ease;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.gray};
  &:disabled {
    color: ${(p) => p.theme.colors.gray};
    cursor: default;
  }
  &:not([disabled], :focus):hover {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.16);
  }
  &:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16),
      0 0 0 2px rgba(255, 255, 255, 0.24);
  }
  &::-webkit-input-placeholder {
    user-select: none;
    color: transparent;
    transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  &:focus::-webkit-input-placeholder,
  &:not(:empty)::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  &::-webkit-textfield-decoration-container {
    visibility: hidden;
  }
`

export default Input

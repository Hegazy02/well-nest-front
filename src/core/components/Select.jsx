import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import React from "react"

export function Select({ children, value, onValueChange, ...props }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={selectRef} className="relative inline-block w-full" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
            value,
          })
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onSelect: (selectedValue) => {
              onValueChange(selectedValue)
              setIsOpen(false)
            },
            value,
          })
        }
        return child
      })}
    </div>
  )
}

export function SelectTrigger({ children, className = "", onClick, isOpen, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
      {...props}
    >
      {children}
      <ChevronDown
        className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  )
}

export function SelectValue({ placeholder = "Select", className = "" }) {
  return <span className={`text-gray-500 ${className}`}>{placeholder}</span>
}

export function SelectContent({ children, isOpen, onSelect, value, className = "" }) {
  if (!isOpen) return null

  return (
    <div
      className={`absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-md ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onClick: () => onSelect(child.props.value),
            isSelected: value === child.props.value,
          })
        }
        return child
      })}
    </div>
  )
}

export function SelectItem({ children, value, onClick, isSelected, className = "" }) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm hover:bg-teal-100 ${
        isSelected ? "bg-teal-500 text-white" : "text-gray-800"
      } ${className}`}
      onClick={onClick}
    >
      {isSelected && <Check className="absolute left-2 h-4 w-4" />}
      <span className="pl-6">{children}</span>
    </div>
  )
}

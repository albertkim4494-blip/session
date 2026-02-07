import React, { useState, useRef, useEffect } from "react";

export function CategoryAutocomplete({ value, onChange, suggestions, placeholder, styles }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const query = (value || "").trim().toLowerCase();
  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query) && s.toLowerCase() !== query)
    : suggestions;

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={styles.textInput}
        placeholder={placeholder}
      />
      {open && filtered.length > 0 && (
        <div style={styles.autocompleteDropdown}>
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              style={styles.autocompleteOption}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setOpen(false);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState, useCallback, useEffect } from "react";
import style from "./AccessibleActionMenu.module.css";


const AccessibleActionMenu = ({
  trigger,
  triggerId,
  triggerClassName,
  menuClassName,
  items = [],
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  itemRefs.current = items.map(
    (_, i) => itemRefs.current[i] || React.createRef()
  );

  const openMenu = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(0);
  }, []);

  const closeMenu = useCallback((returnFocus = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (returnFocus && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const selectItem = useCallback(
    (key) => {
      closeMenu(true);
      onSelect && onSelect(key);
    },
    [closeMenu, onSelect]
  );

  // Focus the active item whenever activeIndex or isOpen changes
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && itemRefs.current[activeIndex]?.current) {
      itemRefs.current[activeIndex].current.focus();
    }
  }, [isOpen, activeIndex]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        closeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeMenu]);

  // Trigger keyboard handler
  const handleTriggerKeyDown = (e) => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        openMenu();
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(items.length - 1);
        break;
      default:
        break;
    }
  };

  // Menu item keyboard handler
  const handleItemKeyDown = (e, index) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((index + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((index - 1 + items.length) % items.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectItem(items[index].key);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  const handleTriggerClick = () => {
    if (isOpen) {
      closeMenu(false);
    } else {
      openMenu();
    }
  };

  return (
    <div className={`${style.menuContainer} ${menuClassName || ""}`}>
      {/* Menu trigger button */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={triggerId ? `${triggerId}-menu` : undefined}
        className={`${style.triggerButton} ${triggerClassName || ""}`}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          ref={menuRef}
          id={triggerId ? `${triggerId}-menu` : undefined}
          role="menu"
          aria-labelledby={triggerId}
          className={style.menu}
        >
          {items.map(({ key, label, icon }, index) => (
            <li key={key} role="none">
              <button
                ref={itemRefs.current[index]}
                role="menuitem"
                type="button"
                tabIndex={activeIndex === index ? 0 : -1}
                className={style.menuItem}
                onClick={() => selectItem(key)}
                onKeyDown={(e) => handleItemKeyDown(e, index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {typeof icon === "string" ? (
                  <img src={icon} className={style.itemIcon} alt="" aria-hidden="true" />
                ) : (
                  <span className={style.itemIcon} aria-hidden="true">{icon}</span>
                )}
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccessibleActionMenu;
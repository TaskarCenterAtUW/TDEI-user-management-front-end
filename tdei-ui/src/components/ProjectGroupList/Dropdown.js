import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import clsx from "clsx";

import style from "./Dropdown.module.css";

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

const Dropdown = ({
  placeHolder,
  options,
  isSearchable,
  onChange,
  onSearchText,
  searchText,
  setSearchText,
  lastProjectGrpListRef,
  loading,
  field,
  form,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const searchRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    setSearchText("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        if (showMenu) {
          form.setFieldTouched(field.name);
        }
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });
  const handleInputClick = (e) => {
    if (showMenu) {
      form.setFieldTouched(field.name);
    }
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return placeHolder;
    }
    return selectedValue.project_group_name;
  };

  const onItemClick = (option) => {
    setSelectedValue(option);
    onChange(option);
  };

  const isSelected = (option) => {
    if (!selectedValue) {
      return false;
    }

    return selectedValue.project_group_name === option.project_group_name;
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
    onSearchText(e.target.value);
  };

  return (
    <>
      <div
        className={clsx(style.dropdownContainer, {
          "is-invalid": form.touched[field.name] && !!form.errors[field.name],
        })}
      >
        <button
          type="button"
          ref={inputRef}
          onClick={handleInputClick}
          className={style.dropdownInput}
        >
          <div className={style.dropdownSelectedValue}>{getDisplay()}</div>
          <div className={style.dropdownTools}>
            <div className={style.dropdownTool}>
              <Icon />
            </div>
          </div>
        </button>
        {showMenu && (
          <div className={style.dropdownMenu}>
            {isSearchable && (
              <div className={style.searchBox}>
                <input
                  className={style.searchInput}
                  onChange={onSearch}
                  value={searchText}
                  ref={searchRef}
                  placeholder="Search Project Group"
                />
              </div>
            )}
            <div className={style.listContainer}>
              {options.map((option, index) => {
                if (options.length === index + 1) {
                  return (
                    // eslint-disable-next-line
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(option);
                      }}
                      key={option.tdei_project_group_id}
                      className={clsx(style.dropdownItem, [
                        isSelected(option) && style.selected,
                      ])}
                      ref={lastProjectGrpListRef}
                      tabIndex="0"
                    >
                      {option.project_group_name}
                    </a>
                  );
                } else {
                  return (
                    // eslint-disable-next-line
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(option)
                      }}
                      key={option.tdei_project_group_id}
                      className={clsx(style.dropdownItem, [
                        isSelected(option) && style.selected,
                      ])}
                      tabIndex="0"
                    >
                      {option.project_group_name}
                    </a>
                  );
                }
              })}
              {loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner size="sm" />
                </div>
              ) : null}
              {options.length === 0 && !loading ? (
                <div> No data present </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {form.touched[field.name] && !!form.errors[field.name] ? (
        <div className="invalid-feedback">{form.errors[field.name]}</div>
      ) : null}
    </>
  );
};

export default Dropdown;

import Select from "react-select";

function LabelDropDown({label, options, defaultValue}){
    return (
        <div>
        <p>{label}</p>
        <Select
                options = {options}


        />
        </div>
    );
}
import Tool from "./Tool.tsx";
import {GoSun} from "react-icons/go";
import {BsMoonStars} from "react-icons/bs";

export const ThemeToggler = (props: { onClick: () => void, theme: "light" | "dark" }) => (
    <div onClick={props.onClick}
         style={{
             boxShadow: "0 4px 16px 0 gray",
             borderRadius: "8px"
         }}>
        <Tool isSelected={false}>
            {
                props.theme === "dark" ?
                    <GoSun color={"black"} size={24}/>
                    :
                    <BsMoonStars color={"black"} size={24}/>
            }
        </Tool>
    </div>
)
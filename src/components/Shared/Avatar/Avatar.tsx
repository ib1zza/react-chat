import React, {memo} from "react";
import s from "./Avatar.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {useInView} from "react-intersection-observer";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    className?: string;
    displayName?: string | null;
}

const Avatar: React.FC<Props> = memo(
    ({displayName, src, className, ...props}) => {
        const options = {
            threshold: 0.2,
            triggerOnce: true,
        };
        const {ref, inView} = useInView(options);

        return (
            <div
                ref={ref}
                className={
                    clsx(s.avatar, !src && s.template, className)
                }
                {...props}
            >
                {inView && src ? (
                    <img src={src} alt={displayName || "avatar"}/>
                ) : (
                    <>{displayName ? (
                        <span>{displayName.charAt(0).toUpperCase()}</span>
                    ) : (
                        <FontAwesomeIcon icon={faUser}/>
                    )}</>
                )}
            </div>
        );
    }
);

export default Avatar;

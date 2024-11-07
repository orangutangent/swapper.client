import React from "react";

interface Props {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

const Right = ({ className, color, width, height }: Props) => {
  return (
    <svg
      className={className}
      width={`${width || 24}px`}
      height={`${height || 24}px`}
      viewBox="0 0 24.00 24.00"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color || "#FFFFFF"}
      stroke-width="0.00024000000000000003"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0" />

      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke={color || "#CCCCCC"}
        stroke-width="0.192"
      />

      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M16.3153 16.6681C15.9247 17.0587 15.9247 17.6918 16.3153 18.0824C16.7058 18.4729 17.339 18.4729 17.7295 18.0824L22.3951 13.4168C23.1761 12.6357 23.1761 11.3694 22.3951 10.5883L17.7266 5.9199C17.3361 5.52938 16.703 5.52938 16.3124 5.91991C15.9219 6.31043 15.9219 6.9436 16.3124 7.33412L19.9785 11.0002L2 11.0002C1.44772 11.0002 1 11.4479 1 12.0002C1 12.5524 1.44772 13.0002 2 13.0002L19.9832 13.0002L16.3153 16.6681Z"
          fill={color || "#FFFFFF"}
        />{" "}
      </g>
    </svg>
  );
};

export default Right;

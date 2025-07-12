export default function Star29({
  color,
  size,
  stroke,
  strokeWidth,
  pathClassName,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  color?: string
  size?: number
  stroke?: string
  pathClassName?: string
  strokeWidth?: number
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      width={size ?? width}
      height={size ?? height}
      {...props}
    >
      <path
        fill={color ?? "currentColor"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={pathClassName}
        d="M80.895 8.558 100 60.811l18.915-52.253c2.186-6.175 11.406-3.705 10.266 2.756l-9.6 54.722 42.583-35.817c5.038-4.18 11.691 2.47 7.509 7.506l-35.74 42.657 54.75-9.69c6.464-1.14 8.935 8.075 2.757 10.26l-52.279 19.095 52.279 18.906c6.178 2.185 3.707 11.401-2.757 10.261l-54.75-9.596 35.835 42.562c4.182 5.035-2.471 11.686-7.509 7.506l-42.678-35.722 9.695 54.722c1.141 6.461-8.079 8.931-10.266 2.756l-19.105-52.253-18.915 52.253c-2.186 6.175-11.406 3.705-10.266-2.756l9.6-54.722-42.583 35.817c-5.038 4.18-11.691-2.471-7.509-7.506l35.74-42.657-54.655 9.691c-6.464 1.14-8.935-8.076-2.757-10.261l52.28-19.095L8.56 81.047c-6.178-2.185-3.707-11.4 2.757-10.26l54.75 9.595L30.232 37.82c-4.182-5.035 2.471-11.686 7.51-7.506l42.677 35.722-9.79-54.722c-1.14-6.46 7.984-8.93 10.266-2.756"
      />
    </svg>
  )
}

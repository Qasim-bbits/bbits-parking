export default function Clock(props) {

    return (
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_6_18)">
        <path d="M22.5 41.25C12.1444 41.25 3.75 32.8556 3.75 22.5C3.75 12.1444 12.1444 3.75 22.5 3.75C32.8556 3.75 41.25 12.1444 41.25 22.5C41.25 32.8556 32.8556 41.25 22.5 41.25ZM24.375 22.5V13.125H20.625V26.25H31.875V22.5H24.375Z" fill="url(#paint0_linear_6_18)"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_6_18" x1="37.4148" y1="7.5" x2="-9.91236" y2="25.4639" gradientUnits="userSpaceOnUse">
        <stop offset="0.0756783" stop-color={props.color}/>
        <stop offset="0.678126" stop-color="#949494"/>
        </linearGradient>
        <clipPath id="clip0_6_18">
        <rect width="45" height="45" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    )
}

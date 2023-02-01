export default function Location(props) {

    return (
        <svg width="30" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 41.25C22.5 41.25 36.5625 30 36.5625 17.8125C36.5625 10.046 30.2665 3.75 22.5 3.75C14.7335 3.75 8.4375 10.046 8.4375 17.8125C8.4375 30 22.5 41.25 22.5 41.25Z" fill="url(#paint0_linear_6_21)"/>
        <path d="M22.5 23.4375C25.6066 23.4375 28.125 20.9191 28.125 17.8125C28.125 14.7059 25.6066 12.1875 22.5 12.1875C19.3934 12.1875 16.875 14.7059 16.875 17.8125C16.875 20.9191 19.3934 23.4375 22.5 23.4375Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <defs>
        <linearGradient id="paint0_linear_6_21" x1="33.6861" y1="7.5" x2="-3.87888" y2="18.1939" gradientUnits="userSpaceOnUse">
        <stop offset="0.0756783" stop-color={props.color}/>
        <stop offset="0.678126" stop-color="#949494"/>
        </linearGradient>
        </defs>
        </svg>
    )
}
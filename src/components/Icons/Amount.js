export default function Amount(props) {

    return (
        <svg width="25" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1082 8.47084L26.0481 1L28.2102 4.7448L30.3722 8.48959L13.1082 8.47084Z" stroke="url(#paint0_linear_6_68)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0 10.375C0 9.33944 0.839466 8.5 1.875 8.5H35.625C36.6606 8.5 37.5 9.33944 37.5 10.375V36.625C37.5 37.6606 36.6606 38.5 35.625 38.5H1.875C0.839466 38.5 0 37.6606 0 36.625V10.375Z" fill="url(#paint1_linear_6_68)"/>
        <path d="M29.2969 28.1875H37.5V18.8125H29.2969C26.5786 18.8125 24.375 20.9112 24.375 23.5C24.375 26.0888 26.5786 28.1875 29.2969 28.1875Z" fill={props.color} stroke={props.color} stroke-width="2" stroke-linejoin="round"/>
        <path d="M37.5 12.7188V35.2188" stroke={props.color} stroke-width="2" stroke-linecap="round"/>
        <g clip-path="url(#clip0_6_68)">
        <path d="M11.25 31.75C13.321 31.75 15.1961 30.9105 16.5533 29.5533C17.9105 28.1961 18.75 26.321 18.75 24.25C18.75 22.179 17.9105 20.3039 16.5533 18.9467C15.1961 17.5895 13.321 16.75 11.25 16.75C9.17895 16.75 7.30395 17.5895 5.9467 18.9467C4.58947 20.3039 3.75 22.179 3.75 24.25C3.75 26.321 4.58947 28.1961 5.9467 29.5533C7.30395 30.9105 9.17895 31.75 11.25 31.75Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M8.25 24.25L10.5 26.5L15 22" stroke="url(#paint2_linear_6_68)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
        <linearGradient id="paint0_linear_6_68" x1="30.7891" y1="0.837182" x2="8.50678" y2="20.1309" gradientUnits="userSpaceOnUse">
        <stop stop-color={props.color}/>
        <stop offset="1" stop-color={props.color}/>
        </linearGradient>
        <linearGradient id="paint1_linear_6_68" x1="33.6648" y1="11.5" x2="-10.5317" y2="32.4695" gradientUnits="userSpaceOnUse">
        <stop offset="0.0756783" stop-color={props.color}/>
        <stop offset="0.678126" stop-color="#949494"/>
        </linearGradient>
        <linearGradient id="paint2_linear_6_68" x1="15.163" y1="21.9022" x2="3.59259" y2="28.4216" gradientUnits="userSpaceOnUse">
        <stop stop-color={props.color}/>
        <stop offset="1" stop-color={props.color}/>
        </linearGradient>
        <clipPath id="clip0_6_68">
        <rect width="18" height="18" fill="white" transform="translate(2.25 15.25)"/>
        </clipPath>
        </defs>
        </svg>
    )
}
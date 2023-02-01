export default function Pin(props) {

  return (
    <svg width="255" height="485" viewBox="0 0 255 485" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="127.5" cy="126.5" rx="127.5" ry="126.5" fill={props.color}/>
        <ellipse cx="128" cy="127" rx="104" ry="106" fill="#eee"/>
        <line x1="130" y1="249" x2="130" y2="469.008" stroke={props.color} strokeWidth="30" strokeLinecap="round"/>
    </svg>
  );
}
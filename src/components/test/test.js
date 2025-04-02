import { useState } from 'react';

export default function Picture() {
  const[isActive, setIsActive] = useState(true)
  
  let backgroundStyle = 'background';
  let pictureStyle = 'picture';
  if(isActive) {
    pictureStyle += ' picture--active';
  }else {
    backgroundStyle += ' background--active';
  }
  
  return (
    <div className={backgroundStyle} onClick={() => setIsActive(true)}>
      <img
        className={pictureStyle}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={(e) => {
          e.stopPropagation();
          setIsActive(false);
        }}
      />
    </div>
  );
}

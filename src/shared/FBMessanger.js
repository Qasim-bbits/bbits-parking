// components/MessengerChat.jsx
import { useEffect, useState } from 'react';

export default function FBMessenger() {
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const addFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) return;

      // Create fb-root if it doesn't exist
      if (!document.getElementById('fb-root')) {
        const fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        document.body.appendChild(fbRoot);
      }

      // Load the Messenger SDK script
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
      script.async = true;
      script.onload = () => {
        console.log('Facebook SDK loaded');
        if (window.FB) {
          window.FB.init({
            xfbml: true,
            version: 'v19.0',
          });
          window.FB.XFBML.parse();
        }
      };
      script.onerror = () => {
        console.error('Failed to load Facebook SDK script.');
      };

      document.body.appendChild(script);
    };

    addFacebookSDK();
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id={100076367640484}
        theme_color="#0084ff"
        logged_in_greeting="Hi! How can we assist you?"
        logged_out_greeting="Please log in to chat with us."
      ></div>
    </>
  );
}

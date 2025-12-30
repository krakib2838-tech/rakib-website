import React, { useEffect, useRef } from 'react';

/**
 * 320x50 Banner Ad
 * Uses an iframe sandbox to safely render the document.write script
 */
export const AdBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current) {
        // Clear previous content
        bannerRef.current.innerHTML = '';

        const iframe = document.createElement('iframe');
        iframe.style.width = '320px';
        iframe.style.height = '50px';
        iframe.style.border = 'none';
        iframe.scrolling = 'no';
        iframe.style.overflow = 'hidden';
        
        bannerRef.current.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:transparent;display:flex;justify-content:center;align-items:center;">
                    <script type="text/javascript">
                        atOptions = {
                            'key' : 'f40259ef8a0f25ba2680a0204f2c7e56',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//www.highperformanceformat.com/f40259ef8a0f25ba2680a0204f2c7e56/invoke.js"></script>
                </body>
                </html>
            `);
            doc.close();
        }
    }
  }, []);

  return (
    <div className="w-full flex justify-center items-center my-4">
        <div ref={bannerRef} className="w-[320px] h-[50px] bg-slate-900/50 rounded shadow-md overflow-hidden" />
    </div>
  );
};

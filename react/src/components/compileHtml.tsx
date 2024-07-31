import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';

interface CompileHtmlProps {
    html: string;
}

const CompileHtml: React.FC<CompileHtmlProps> = ({ html }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (elementRef.current) {
            elementRef.current.innerHTML = html;

            const scripts = elementRef.current.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const script = document.createElement('script');
                script.type = scripts[i].type || 'text/javascript';
                if (scripts[i].src) {
                    script.src = scripts[i].src;
                } else {
                    script.appendChild(document.createTextNode(scripts[i].innerHTML));
                }
                document.head.appendChild(script).parentNode?.removeChild(script);
            }
    }, [html]);

    return <div ref={elementRef}></div>;
};

export default CompileHtml;

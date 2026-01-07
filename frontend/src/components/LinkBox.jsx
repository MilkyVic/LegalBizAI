import React from 'react';

const LinkBox = ({ links }) => {
    return (
        <div className="flex flex-wrap">
            {links.map((link, index) => (
                <div key={index} className="p-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        <a href={link.link} target="_blank" rel="noopener noreferrer">{link.title}</a>
                    </span>
                </div>
            ))}
        </div>
    );
};

export default LinkBox;


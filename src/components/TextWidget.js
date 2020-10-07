import React from 'react'

function TextWidget(props) {
    return (
        <div className="text-widget">
            <div className="widget-title">{props.title}</div>
            <div className="widget-value">
                <div className="value">
                {props.value}
                </div>
                <div className="description">
                 {props.description}
                </div>
                </div>
        </div>
    )
}

export default TextWidget;

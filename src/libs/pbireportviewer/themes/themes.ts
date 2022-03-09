export const Executive = {
    "name": "Executive",
    "dataColors": ["#3257A8", "#37A794", "#8B3D88", "#DD6B7F", "#6B91C9", "#F5C869", "#77C4A8", "#DEA6CF"],
    "background": "#FFFFFF",
    "foreground": "#9C5252",
    "tableAccent": "#6076B4"
}

export const Tidal = {
    "name": "Tidal",
    "dataColors": ["#094782", "#0B72D7", "#098BF5", "#54B5FB", "#71C0A7", "#57B956", "#478F48", "#326633"],
    "tableAccent": "#094782",
    "visualStyles": {
        "*": {
            "*": {
                "background": [{ "show": true, "transparency": 3 }],
                "visualHeader": [{
                    "foreground": { "solid": { "color": "#094782" } },
                    "transparency": 3
                }]
            }
        },
        "group": { "*": { "background": [{ "show": false }] } },
        "basicShape": { "*": { "background": [{ "show": false }] } },
        "image": { "*": { "background": [{ "show": false }] } },
        "page": {
            "*": {
                "background": [{ "transparency": 100 }],
            }
        }
    }
}

export const Default = {
    "name": "Default",
    "dataColors": ["#1A81FB", "#142091", "#E16338", "#5F076E", "#DA3F9D", "#6945B8", "#D3AA22", "#CF404A"],
    "foreground": "#252423",
    "background": "#FFFFFF",
    "tableAccent": "#B73A3A"
}
export const Divergent = {
    "name": "Divergent",
    "dataColors": ["#B73A3A", "#EC5656", "#F28A90", "#F8BCBD", "#99E472", "#23C26F", "#0AAC00", "#026645"],
    "foreground": "#252423",
    "background": "#F4F4F4",
    "tableAccent": "#B73A3A"
}

export const DarkTheme = {
    "name": "Innovate",
    "dataColors": ["#00A4EF", "#FF6D00", "#2878BD", "#7FBA00", "#FFB900", "#AF916D", "#C4B07B", "#F25022", "#3599B8", "#DFBFBF", "#4AC5BB", "#5F6B6D", "#FB8281", "#F4D25A", "#7F898A", "#A4DDEE", "#FDAB89", "#B687AC", "#28738A", "#A78F8F", "#168980", "#293537", "#BB4A4A", "#B59525", "#475052", "#6A9FB0", "#BD7150", "#7B4F71", "#1B4D5C", "#706060", "#0F5C55", "#1C2325"],
    "foreground": "#FFFFFF",
    "foregroundNeutralSecondary": "#D2D0CE",
    "foregroundNeutralTertiary": "#979593",
    "background": "#3a3a3a",
    "backgroundLight": "#3B3A39",
    "backgroundNeutral": "#605E5C",
    "tableAccent": "#2878BD",
    "maximum": "#2878BD",
    "center": "#FCB714",
    "minimum": "#D0E4F5",
    "hyperlink": "#2878BD",
    "visitedHyperlink": "#D0E4F5",
    "textClasses": {
        "callout": {
            "fontFace": "Arial",
            "color": "#FFFFFF"
        },
        "title": {
            "fontFace": "Arial",
            "color": "#FFFFFF"
        },
        "header": {
            "fontFace": "Arial",
            "color": "#FFFFFF"
        },
        "label": { 
            "fontFace": "Arial",
             "color": "#FFFFFF" 
            }
    }, "visualStyles": { "*": { "*": { "background": [{ "color": { "solid": { "color": "#3a3a3a" } } }], "visualHeader": [{ "foreground": { "solid": { "color": "#FFFFFF" } }, "border": { "solid": { "color": "#3a3a3a" } }, "background": { "solid": { "color": "#3a3a3a" } } }], "outspacePane": [{ "backgroundColor": { "solid": { "color": "#3a3a3a" } }, "foregroundColor": { "solid": { "color": "#FFFFFF" } }, "transparency": 0, "border": true, "borderColor": { "solid": { "color": "#979593" } } }], "filterCard": [{ "$id": "Applied", "transparency": 0, "foregroundColor": { "solid": { "color": "#FFFFFF" } }, "backgroundColor": { "solid": { "color": "#605E5C" } }, "inputBoxColor": { "solid": { "color": "#605E5C" } }, "borderColor": { "solid": { "color": "#979593" } }, "border": true }, { "$id": "Available", "transparency": 0, "foregroundColor": { "solid": { "color": "#FFFFFF" } }, "backgroundColor": { "solid": { "color": "#3a3a3a" } }, "inputBoxColor": { "solid": { "color": "#3a3a3a" } }, "borderColor": { "solid": { "color": "#979593" } }, "border": true }] } }, "slicer": { "*": { "items": [{ "background": { "solid": { "color": "#3a3a3a" } } }], "numericInputStyle": [{ "background": { "solid": { "color": "#3a3a3a" } } }] } }, "keyDriversVisual": { "*": { "keyInfluencersVisual": [{ "canvasColor": { "solid": { "color": "#3B3A39" } } }] } }, "page": { "*": { "outspace": [{ "color": { "solid": { "color": "#000000" } } }], "background": [{ "transparency": 0 }] } } }
}

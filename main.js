(function() {
    'use strict'

    var styleDiv = document.createElement('style')
    styleDiv.type = 'text/css'
    styleDiv.innerHTML = '.no_touch { pointer-events: none !important; background-color: black !important; }'
    document.head.appendChild(styleDiv)

    var pendingBoxes = new Map()
    var pendingTimeout = null
    function disableBoxes(boxes) {
        var pp = document.body.getBoundingClientRect()
        for(var i = 0; i < boxes.length; ++i) {
            var box = boxes[i]
            box.classList.add('no_touch')
            var timeout = pendingBoxes.get(box)
            if(timeout !== undefined) {
                clearTimeout(timeout)
            }
            timeout = setTimeout((function(box) {
                return function() {
                    box.classList.remove('no_touch')
                }
            })(box), 400)
            pendingBoxes.set(box, timeout)
        }
    }

    function positions(parent, obj, result, hideRects) {
        if('getBoundingClientRect' in obj) {
            var rect = obj.getBoundingClientRect()
            var prev = result.get(obj)
            if(!prev || 
                Math.abs(prev.x - rect.x) > 30 || 
                Math.abs(prev.y - rect.y) > 30 || 
                Math.abs(prev.width - rect.width) > 30 || 
                Math.abs(prev.height - rect.height) > 30) {
                    hideRects.push(obj)
            }
            result.set(obj, rect)
        } 
        for(var i = 0; i < obj.childNodes.length;  ++i) {
            positions(rect, obj.childNodes[i], result, hideRects)
        }
    }
    var map = new Map()
    setInterval(function() {
        var hideRects = []
        positions(null, document.body, map, hideRects)
        if(hideRects.length > 0) {
            // console.log(hideRects)
            disableBoxes(hideRects)
        }
    }, 0)
})()

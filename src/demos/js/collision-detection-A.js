window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth-4;
    var height = canvas.height = window.innerHeight-4;
    var demoType = getUrlVar()['collision-type'];


    // Select DEMO TYPE:
    switch (demoType) {

        case 'circle-circle':
            var circle0 = {
                x: width / 2,
                y: height / 2,
                radius: 300
            };

            var circle1 = {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 50 + Math.random() * 100
            };
        break;

        case 'circle-point':
            var circle0 = {
                x: width / 2,
                y: height / 2,
                radius: 300
            };

        case 'rectangle-point':
            var rectangle0 = {
                x: 300,
                y: 200,
                width: 200,
                height: 200
            };
        break;

        case 'rectangle-rectangle':
            var rectangle0 = {
                x: 300,
                y: 200,
                width: 200,
                height: 200
            };

            var rectangle1 = {
                x: 100,
                y: 50,
                width: 100,
                height: 100
            };
        break;

        default:
            var rectangle0 = {
                x: 300,
                y: 200,
                width: 200,
                height: 200
            };
        break;
    }

    // Animation control: KeyDown
    document.body.addEventListener("mousemove", function(e) {

        var figure0 = null, 
            figure1 = null;

        // Clear canvas
        ctx.clearRect(0,0, width, height); 

        // Render DEMO TYPE:
        switch (demoType) {

            // Detects CIRCLE - CIRCLE collisions
            case 'circle-circle':

                figure0 = circle0;
                figure1 = circle1;

                figure1.x = e.clientX;
                figure1.y = e.clientY;

                if (Utils.circleCollition(figure0, figure1)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }         

                ctx.beginPath();
                ctx.arc(figure0.x, figure0.y, figure0.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(circle1.x, circle1.y, circle1.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();

            break;

            // Detects CIRCLE - POINT collisions
            case 'circle-point':

                figure0 = circle0;

                if (Utils.circlePointCollition(e.clientX, e.clientY, figure0)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                // Draw demo elements
                ctx.clearRect(0,0, width, height);            

                ctx.beginPath();
                ctx.arc(figure0.x, figure0.y, figure0.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
            break;

            // Detects RECTANGLE - POINT collisions
            case 'rectangle-rectangle':
                figure0 = rectangle0;
                figure1 = rectangle1;

                figure1.x = e.clientX;
                figure1.y = e.clientY;

                if (Utils.rectangleCollition(figure0, figure1)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                ctx.beginPath();
                ctx.fillRect(figure0.x, figure0.y, figure0.width, figure0.height);
                ctx.closePath();

                ctx.beginPath();
                ctx.fillRect(figure1.x, figure1.y, figure1.width, figure1.height);
                ctx.beginPath();
            break;

            // Detects RECTANGLE - POINT collisions
            default:
                figure0 = rectangle0;

                if (Utils.rectanglePointCollition(e.clientX, e.clientY, figure0)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                ctx.beginPath();
                ctx.fillRect(figure0.x, figure0.y, figure0.width, figure0.height);
                ctx.closePath();
            break;
        }
    });

};

function getUrlVar() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}